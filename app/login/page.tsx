'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

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
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
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

      <div style={{ width: 'min(440px, calc(100% - 32px))', margin: '0 auto' }}>
        <div style={{
          borderRadius: '28px',
          padding: '40px 36px 36px',
          background: 'rgba(255, 251, 246, 0.84)',
          border: '1px solid hsla(0,0%,100%,.35)',
          boxShadow: '0 40px 80px rgba(48, 26, 16, 0.2)',
          backdropFilter: 'blur(24px) saturate(120%)',
        }}>
          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '28px', fontFamily: 'var(--font-display), serif', fontWeight: 700, color: 'var(--ink)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: 'var(--ink)', boxShadow: '0 0 0 5px rgba(26,18,14,.08)' }}></span>
              kaya<span style={{ opacity: 0.5 }}>.ge</span>
            </Link>
          </div>

          <h1 style={{ margin: '0 0 6px', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontFamily: 'var(--font-display), serif', fontWeight: 700, lineHeight: 1.05, textAlign: 'center' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '22px 0', color: 'rgba(36,23,18,.58)' }}>
            <span style={{ flex: 1, height: '1px', background: 'rgba(36,23,18,.1)' }}></span>
            <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'lowercase' }}>or</span>
            <span style={{ flex: 1, height: '1px', background: 'rgba(36,23,18,.1)' }}></span>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', margin: 0 }}>
            New to Kaya.ge?{' '}
            <Link href="/signup" style={{ fontWeight: 700, color: 'var(--ink)' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
