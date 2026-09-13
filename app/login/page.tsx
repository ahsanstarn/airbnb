'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(900px circle at 8% 8%, rgba(255, 215, 188, 0.45), transparent 60%), radial-gradient(700px circle at 92% 96%, hsla(21, 76%, 82%, 0.35), transparent 60%), linear-gradient(180deg, var(--surface, #fff7ef), var(--surface-warm, #f8e2cb) 65%, var(--surface-deep, #f3d1b3))',
      color: 'var(--ink, #241712)',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'var(--card-bg, rgba(255, 252, 248, 0.94))',
        border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.12))',
        borderRadius: '28px',
        padding: '36px 32px',
        boxShadow: '0 24px 60px -12px rgba(36, 24, 19, 0.22)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', marginBottom: '8px' }}>
            <span className="brandmark-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent, #d9653b)' }}></span>
            <span style={{ fontFamily: 'var(--font-display), serif', fontSize: '28px', fontWeight: 'bold', color: 'var(--ink, #241712)' }}>
              kaya<span style={{ opacity: 0.6 }}>.ge</span>
            </span>
          </Link>
          <p style={{ color: 'var(--muted, rgba(36, 23, 18, 0.65))', fontSize: '14px', margin: 0 }}>Welcome back to Georgia</p>
        </div>

        {/* Quick Fill Demo Credentials */}
        <div style={{
          background: 'rgba(217, 101, 59, 0.08)',
          border: '1px dashed rgba(217, 101, 59, 0.3)',
          borderRadius: '16px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent, #d9653b)' }}>
            Quick Demo Accounts (1-Click Fill)
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@kaya.ge', 'admin123')}
              style={{
                flex: 1, padding: '6px 10px', fontSize: '12px', fontWeight: 600,
                borderRadius: '8px', border: '1px solid var(--border-mid, rgba(26,18,14,0.12))',
                background: '#fff', color: 'var(--ink, #241712)', cursor: 'pointer'
              }}
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('host@kaya.ge', 'host123')}
              style={{
                flex: 1, padding: '6px 10px', fontSize: '12px', fontWeight: 600,
                borderRadius: '8px', border: '1px solid var(--border-mid, rgba(26,18,14,0.12))',
                background: '#fff', color: 'var(--ink, #241712)', cursor: 'pointer'
              }}
            >
              🏡 Host
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('tourist@kaya.ge', 'tourist123')}
              style={{
                flex: 1, padding: '6px 10px', fontSize: '12px', fontWeight: 600,
                borderRadius: '8px', border: '1px solid var(--border-mid, rgba(26,18,14,0.12))',
                background: '#fff', color: 'var(--ink, #241712)', cursor: 'pointer'
              }}
            >
              🧳 Tourist
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(208, 74, 59, 0.1)',
            color: '#d04a3b',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 500,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--ink, #241712)' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. admin@kaya.ge"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#fff',
                border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))',
                borderRadius: '12px',
                color: 'var(--ink, #241712)',
                outline: 'none',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--ink, #241712)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#fff',
                border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))',
                borderRadius: '12px',
                color: 'var(--ink, #241712)',
                outline: 'none',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'var(--ink, #241712)',
              color: 'var(--accent-ink, #fff8f1)',
              border: 'none',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginTop: '4px',
              boxShadow: '0 8px 20px -4px rgba(36, 24, 19, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted, rgba(36, 23, 18, 0.65))' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--accent, #d9653b)', fontWeight: 700, textDecoration: 'none' }}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
