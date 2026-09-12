'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tourist');
  const [referralCode, setReferralCode] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role, referralCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('kaya_token', data.token);
      }
      
      if (role === 'business') {
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

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#fff',
    border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))',
    borderRadius: '12px',
    color: 'var(--ink, #241712)',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s, box-shadow 0.2s',
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
        maxWidth: '460px',
        backgroundColor: 'var(--card-bg, rgba(255, 252, 248, 0.94))',
        border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.12))',
        borderRadius: '28px',
        padding: '36px 32px',
        boxShadow: '0 24px 60px -12px rgba(36, 24, 19, 0.22)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxHeight: '92vh',
        overflowY: 'auto'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', marginBottom: '8px' }}>
            <span className="brandmark-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent, #d9653b)' }}></span>
            <span style={{ fontFamily: 'var(--font-display), serif', fontSize: '28px', fontWeight: 'bold', color: 'var(--ink, #241712)' }}>
              kaya<span style={{ opacity: 0.6 }}>.ge</span>
            </span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: '24px', fontWeight: 600, margin: '4px 0 6px', color: 'var(--ink)' }}>Create your account</h1>
          <p style={{ color: 'var(--muted, rgba(36, 23, 18, 0.65))', fontSize: '13.5px', margin: 0 }}>Join Georgia&apos;s travel &amp; hospitality community</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(217, 101, 59, 0.1)',
            color: 'var(--accent, #d9653b)',
            border: '1px solid rgba(217, 101, 59, 0.25)',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--ink, #241712)' }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Giorgi Beridze"
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--ink, #241712)' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--ink, #241712)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ink, #241712)' }}>Account Type</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                padding: '12px',
                border: role === 'tourist' ? '2px solid var(--accent, #d9653b)' : '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))',
                backgroundColor: role === 'tourist' ? 'rgba(217, 101, 59, 0.08)' : '#fff',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: role === 'tourist' ? 700 : 500,
                color: role === 'tourist' ? 'var(--accent, #d9653b)' : 'var(--ink)',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="tourist"
                  checked={role === 'tourist'}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ display: 'none' }}
                />
                <span>🎒 Traveler / Tourist</span>
              </label>
              <label style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                padding: '12px',
                border: role === 'business' ? '2px solid var(--accent, #d9653b)' : '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))',
                backgroundColor: role === 'business' ? 'rgba(217, 101, 59, 0.08)' : '#fff',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: role === 'business' ? 700 : 500,
                color: role === 'business' ? 'var(--accent, #d9653b)' : 'var(--ink)',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="business"
                  checked={role === 'business'}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ display: 'none' }}
                />
                <span>🏨 Host / Business</span>
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--ink, #241712)' }}>Referral Code (Optional)</label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="e.g. KAYA2026"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, var(--accent, #d9653b), var(--accent-deep, #be4f27))',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginTop: '8px',
              boxShadow: '0 8px 24px -4px rgba(217, 101, 59, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '13.5px', color: 'var(--muted, rgba(36, 23, 18, 0.65))' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent, #d9653b)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface, #fff7ef)', color: 'var(--ink, #241712)' }}>
        Loading...
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
