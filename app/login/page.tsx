'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('kaya_token', data.token);
      }

      let redirectUrl: string | null = null;
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        redirectUrl = urlParams.get('redirect');
      }
      
      if (redirectUrl && !redirectUrl.startsWith('//') && (redirectUrl.startsWith('/') || redirectUrl.startsWith('http'))) {
        router.push(redirectUrl);
      } else if (data.user?.role === 'admin') {
        router.push('/admin');
      } else if (data.user?.role === 'business') {
        router.push('/business/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-bg">
      {/* Cinematic Alpine Background Image */}
      <div className="login-backdrop-image" />

      {/* Atmospheric Animated Gradient Orbs */}
      <div className="login-orb-1" />
      <div className="login-orb-2" />

      {/* Glassmorphic Login Card */}
      <div className="login-glass-card animate-blur-in">
        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '8px' }}>
            <span className="brandmark-dot" style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--accent, #d9653b)', boxShadow: '0 0 12px var(--accent, #d9653b)' }}></span>
            <span style={{ fontFamily: 'var(--font-display), serif', fontSize: '32px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '-0.02em' }}>
              kaya<span style={{ opacity: 0.6 }}>.ge</span>
            </span>
          </Link>
          <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '14px', margin: '4px 0 0' }}>
            Welcome back to Georgia&apos;s Travel Ecosystem
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(208, 74, 59, 0.18)',
            border: '1px solid rgba(208, 74, 59, 0.4)',
            color: '#fca5a5',
            padding: '12px 16px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 500,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Email Field with Vector Icon */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Email Address
            </label>
            <div className="login-input-wrapper">
              <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="login-input-field"
              />
            </div>
          </div>

          {/* Password Field with Vector Icon & Show/Hide Toggle */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Password
              </label>
              <Link href="/auth/forgot-password" style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
            <div className="login-input-wrapper">
              <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="login-input-field"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: 'var(--accent, #d9653b)', cursor: 'pointer' }}
            />
            <label htmlFor="rememberMe" style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', cursor: 'pointer' }}>
              Keep me signed in
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="login-submit-btn"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.65)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#f59e0b', fontWeight: 700, textDecoration: 'none' }}>
            Create one &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

