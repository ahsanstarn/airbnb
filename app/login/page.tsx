'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
    <div className="site-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Glass nav */}
      <div className="sticky-nav-shell visible" style={{ top: '54px', transform: 'translateX(-50%)' }}>
        <nav className="nav nav-sticky-bar" style={{ transform: 'scale(1.08)' }}>
          <Link href="/" className="nav-brand">
            <span className="brandmark-dot"></span>
            <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
          </Link>
            <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu">
              <span></span><span></span><span></span>
            </button>
          <div className="nav-links">
             <Link href="/klara">KLARA</Link>
             <Link href="/search">Visitors</Link>
            <Link href="/hotels">Stays</Link>
            <Link href="/muse">Where to go</Link>
            <Link href="/contact">Contact us</Link>
          </div>
          <div className="nav-spacer"></div>
          <div className="nav-right">
            <Link href="/login">Become a host</Link>
            <Link href="/login" className="nav-icon" aria-label="Login">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"></path></svg>
            </Link>
          </div>
        </nav>
      </div>

        {/* Mobile Nav Overlay */}
        <div className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}>
          <button className="mobile-nav-overlay-close" onClick={() => setMobileNavOpen(false)}>✕</button>
          <Link href="/klara" onClick={() => setMobileNavOpen(false)}>KLARA</Link>
          <Link href="/search" onClick={() => setMobileNavOpen(false)}>Visitors</Link>
          <Link href="/hotels" onClick={() => setMobileNavOpen(false)}>Stays</Link>
          <Link href="/muse" onClick={() => setMobileNavOpen(false)}>Where to go</Link>
          <Link href="/contact" onClick={() => setMobileNavOpen(false)}>Contact us</Link>
          <Link href="/login" onClick={() => setMobileNavOpen(false)}>Become a host</Link>
        </div>

      <div style={{ width: 'min(440px, calc(100% - 32px))', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{
          borderRadius: '28px',
          padding: '40px 36px 36px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow)',
          backdropFilter: 'blur(24px) saturate(120%)',
          WebkitBackdropFilter: 'blur(24px) saturate(120%)',
        }}>
          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '28px', fontFamily: 'var(--font-display), serif', fontWeight: 700, color: 'var(--ink)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: 'var(--ink)', boxShadow: '0 0 0 5px var(--border-light)' }}></span>
              kaya<span style={{ opacity: 0.5 }}>.ge</span>
            </Link>
          </div>

          <h1 style={{ margin: '0 0 6px', color: 'var(--text-primary)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontFamily: 'var(--font-display), serif', fontWeight: 700, lineHeight: 1.05, textAlign: 'center' }}>
            Welcome back
          </h1>
          <p style={{ margin: '0 0 28px', textAlign: 'center', color: 'var(--muted)', fontSize: '14px', lineHeight: 1.5 }}>
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: '14px',
                background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)',
                color: '#b0314d', fontSize: '13px', fontWeight: 600, marginBottom: '18px',
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{
                padding: '12px 16px', borderRadius: '14px',
                background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)',
                color: '#287a43', fontSize: '13px', fontWeight: 600, marginBottom: '18px',
              }}>
                {success}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: 'rgba(36,23,18,.7)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                style={{
                  width: '100%', padding: '16px 18px', borderRadius: '18px',
                  border: '1px solid rgba(36,23,18,.14)',
                  background: 'hsla(0,0%,100%,.84)',
                  color: 'var(--ink)', outline: 'none', fontSize: '14px',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(180,84,45,.6)'; e.target.style.boxShadow = '0 0 0 4px rgba(180,84,45,.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(36,23,18,.14)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(36,23,18,.7)' }}>Password</label>
                <Link href="/login" style={{ fontSize: '12px', color: 'var(--muted)' }}>Forgot?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '16px 18px', borderRadius: '18px',
                  border: '1px solid rgba(36,23,18,.14)',
                  background: 'hsla(0,0%,100%,.84)',
                  color: 'var(--ink)', outline: 'none', fontSize: '14px',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(180,84,45,.6)'; e.target.style.boxShadow = '0 0 0 4px rgba(180,84,45,.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(36,23,18,.14)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '16px 22px', border: '0', borderRadius: '999px',
                background: loading ? 'rgba(26,18,14,.6)' : '#1a120e',
                color: '#fff8ef', fontSize: '15px', fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px -8px rgba(26,18,14,.4)'; }}}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '22px 0', color: 'var(--muted)' }}>
              <span style={{ flex: 1, height: '1px', background: 'var(--border)' }}></span>
              <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'lowercase' }}>or continue with</span>
              <span style={{ flex: 1, height: '1px', background: 'var(--border)' }}></span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => {}}
                style={{
                  flex: 1, padding: '14px', borderRadius: '18px', border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-light)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--glass-bg)'; }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => {}}
                style={{
                  flex: 1, padding: '14px', borderRadius: '18px', border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-light)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--glass-bg)'; }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', margin: 0 }}>
              New to Kaya.ge?{' '}
              <Link href="/signup" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Create an account</Link>
            </p>
        </div>
      </div>
    </div>
  );
}
