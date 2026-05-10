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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/');
    });
  }, [router]);

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
