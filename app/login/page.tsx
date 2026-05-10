'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [accountType, setAccountType] = useState<'tourist' | 'business'>('tourist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role: accountType
            }
          }
        });
        
        if (signUpError) throw signUpError;
        alert('Registration successful! Please check your email to verify.');
        setMode('login');
      } else {
        // Check for admin
        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.toLowerCase().trim()));
        const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        const isAdmin = hashHex === '5a1f85ff5a73d150d8e118522ca01273c5af85ce1318a33a5f98a5846af6439b';
        
        if (isAdmin) {
          localStorage.setItem('kaya_admin', 'true');
          alert('Welcome, Admin!');
          router.push('/');
          return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw signInError;
        router.push('/');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during authentication');
      } else {
        setError('An error occurred during authentication');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'OAuth error');
      } else {
        setError('OAuth error');
      }
    }
  };

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.logo}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="#E8573A" opacity="0.15"/>
          <path d="M16 6l3.09 6.26L26 13.27l-5 4.87 1.18 6.88L16 21.77l-6.18 3.25L11 18.14l-5-4.87 6.91-1.01L16 6z" fill="#E8573A"/>
        </svg>
        <span>kaya</span>
      </Link>

      <div className={styles.card}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`} onClick={() => { setMode('login'); setError(null); }}>Log in</button>
          <button className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`} onClick={() => { setMode('register'); setError(null); }}>Sign up</button>
        </div>

        <h1 className={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>

        {mode === 'register' && (
          <div className={styles.typeToggle}>
            <button className={`${styles.typeBtn} ${accountType === 'tourist' ? styles.typeBtnActive : ''}`} onClick={() => setAccountType('tourist')}>
              🧳 Tourist
            </button>
            <button className={`${styles.typeBtn} ${accountType === 'business' ? styles.typeBtnActive : ''}`} onClick={() => setAccountType('business')}>
              🏢 Business
            </button>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className={styles.input} required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className={styles.input} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className={styles.input} required />

          {mode === 'register' && accountType === 'business' && (
            <>
              <input type="text" placeholder="Business name" className={styles.input} required />
              <select className={styles.input}>
                <option value="">Select category</option>
                <option>Hotel / Guesthouse</option>
                <option>Restaurant / Cafe</option>
                <option>Car Rental</option>
                <option>Tour Operator</option>
                <option>Beauty / Spa</option>
                <option>Service Provider</option>
              </select>
            </>
          )}

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Processing...' : (mode === 'login' ? 'Log in' : 'Sign up')}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <div className={styles.socials}>
          <button className={styles.socialBtn} onClick={() => handleOAuth('google')}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <button className={styles.socialBtn} onClick={() => handleOAuth('facebook')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continue with Facebook
          </button>
        </div>

        <p className={styles.footer}>
          {mode === 'login' ? (
            <>Don&apos;t have an account? <button onClick={() => { setMode('register'); setError(null); }}>Sign up</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode('login'); setError(null); }}>Log in</button></>
          )}
        </p>
      </div>
    </div>
  );
}
