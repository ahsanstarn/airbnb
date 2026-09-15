'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <div className="login-glass-card animate-blur-in">
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(208, 74, 59, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2" width="28" height="28">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, margin: '0 0 8px' }}>
            Invalid Reset Link
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '13px', margin: '0 0 20px' }}>
            This password reset link is invalid or missing a token.
          </p>
          <Link href="/auth/forgot-password" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#f59e0b',
            fontSize: '13.5px',
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-glass-card animate-blur-in">
      <div style={{ textAlign: 'center' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '8px' }}>
          <span className="brandmark-dot" style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--accent, #d9653b)', boxShadow: '0 0 12px var(--accent, #d9653b)' }}></span>
          <span style={{ fontFamily: 'var(--font-display), serif', fontSize: '32px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '-0.02em' }}>
            kaya<span style={{ opacity: 0.6 }}>.ge</span>
          </span>
        </Link>
        <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '14px', margin: '4px 0 0' }}>
          Create a new password
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
        <div style={{
          backgroundColor: 'rgba(44, 157, 111, 0.18)',
          border: '1px solid rgba(44, 157, 111, 0.4)',
          color: '#86efac',
          padding: '16px',
          borderRadius: '14px',
          fontSize: '13px',
          fontWeight: 500,
          textAlign: 'center',
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" style={{ marginBottom: '8px' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p style={{ margin: 0 }}>Password updated successfully!</p>
          <p style={{ margin: '8px 0 0', fontSize: '12px', opacity: 0.7 }}>Redirecting to sign in...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              New Password
            </label>
            <div className="login-input-wrapper">
              <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
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

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Confirm Password
            </label>
            <div className="login-input-wrapper">
              <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your password"
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
                <span className="button-spinner" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </>
            )}
          </button>
        </form>
      )}

      <div style={{ textAlign: 'center', fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.65)' }}>
        <Link href="/login" style={{ color: '#f59e0b', fontWeight: 700, textDecoration: 'none' }}>
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="login-page-bg">
      <div className="login-backdrop-image" />
      <div className="login-orb-1" />
      <div className="login-orb-2" />
      <Suspense fallback={
        <div className="login-glass-card">
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading...</div>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
