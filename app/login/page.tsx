'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/lang-context';
import { createClient } from '@supabase/supabase-js';

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { lang: currentLang, setLang, t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      setSocialLoading(null);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Social login failed');
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('kaya_token', data.session?.access_token || '');
      setSuccess('Signed in successfully!');
      setTimeout(() => router.push('/admin'), 500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const message = err.message.toLowerCase();
        if (message.includes('invalid login credentials')) {
          setError('Invalid email or password.');
        } else if (message.includes('email not confirmed')) {
          setError('Please confirm your email first.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      {/* Left Visual Panel */}
      <div className="login-visual" style={{ backgroundImage: 'url(https://kaya-rent.vercel.app/_next/static/media/kazbegi.721f4951.jpeg)' }}>
        <div className="login-visual-overlay"></div>
        <div className="login-visual-content">
          <h2>{t('welcomeBack')}</h2>
          <p>{t('loginDesc')}</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="login-form-wrap">
        <div className="login-form">
          <h1>{t('welcomeBack')}</h1>
          <p>{t('loginDesc')}</p>

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#b0314d', fontSize: '13px', marginBottom: '20px' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', color: '#287a43', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label>{t('emailLabel')}</label>
              <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="login-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ marginBottom: 0 }}>{t('passwordLabel')}</label>
                <button type="button" className="login-forgot">{t('forgotPassword')}</button>
              </div>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="login-submit" disabled={loading || !!socialLoading}>
              {loading ? t('signingIn') : t('signInBtn')}
            </button>
          </form>

          <div className="login-divider">{t('orContinue')}</div>

          <div className="login-socials">
            <button type="button" className="login-social-btn" onClick={() => handleSocialLogin('google')} disabled={loading || !!socialLoading}>
              {socialLoading === 'google' ? (
                <span style={{ fontSize: '11px' }}>Connecting...</span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </>
              )}
            </button>
            
            <button type="button" className="login-social-btn" onClick={() => handleSocialLogin('facebook')} disabled={loading || !!socialLoading}>
              {socialLoading === 'facebook' ? (
                <span style={{ fontSize: '11px' }}>Connecting...</span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </>
              )}
            </button>
          </div>

          <p className="login-signup">
            {t('newToKaya')} <Link href="/signup">{t('createAccount')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
