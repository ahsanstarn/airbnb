'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResetUrl('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset link');
      }

      setSuccess(true);
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-bg">
      <div className="login-backdrop-image" />
      <div className="login-orb-1" />
      <div className="login-orb-2" />

      <div className="login-glass-card animate-blur-in">
        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '8px' }}>
            <span className="brandmark-dot" style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--accent, #d9653b)', boxShadow: '0 0 12px var(--accent, #d9653b)' }}></span>
            <span style={{ fontFamily: 'var(--font-display), serif', fontSize: '32px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '-0.02em' }}>
              kaya<span style={{ opacity: 0.6 }}>.ge</span>
            </span>
          </Link>
          <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '14px', margin: '4px 0 0' }}>
            Reset your password
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
          }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center' }}>
            <div style={{
              backgroundColor: 'rgba(44, 157, 111, 0.18)',
              border: '1px solid rgba(44, 157, 111, 0.4)',
              color: '#86efac',
              padding: '16px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: 500,
              textAlign: 'center',
              width: '100%',
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" style={{ marginBottom: '8px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p style={{ margin: 0 }}>If an account exists with that email, a reset link has been sent.</p>
              <p style={{ margin: '8px 0 0', fontSize: '12px', opacity: 0.7 }}>Check your inbox and follow the link to reset your password.</p>
            </div>

            {resetUrl && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '14px',
                padding: '12px 16px',
                width: '100%',
              }}>
                <p style={{ margin: '0 0 8px', fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Development Mode — Reset Link:
                </p>
                <a
                  href={resetUrl}
                  style={{
                    color: '#f59e0b',
                    fontSize: '12px',
                    wordBreak: 'break-all',
                    textDecoration: 'underline',
                  }}
                >
                  {resetUrl}
                </a>
              </div>
            )}

            <Link href="/login" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: '13.5px',
              textDecoration: 'none',
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '13px', textAlign: 'center', margin: 0 }}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

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
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}

        {!success && (
          <div style={{ textAlign: 'center', fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.65)' }}>
            Remember your password?{' '}
            <Link href="/login" style={{ color: '#f59e0b', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
