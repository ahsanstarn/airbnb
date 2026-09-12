'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Referral {
  _id: string;
  email?: string;
  status: string;
  createdAt: string;
}

interface AffiliateStats {
  affiliateCode: string;
  totalClicks: number;
  totalRegistered: number;
  totalActive: number;
  referrals: Referral[];
}

export default function AffiliatesDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchStats = async () => {
      try {
        // Check auth
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          router.push('/login');
          return;
        }
        
        // Fetch stats
        const statsRes = await fetch('/api/affiliates');
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndFetchStats();
  }, [router]);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface, #fff7ef)', color: 'var(--ink, #241712)', padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-display), serif', fontSize: '1.2rem' }}>Loading affiliate stats...</div>;
  }

  const referralLink = stats?.affiliateCode 
    ? `https://kaya.ge/signup?ref=${stats.affiliateCode}` 
    : 'No code available';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maskEmail = (email?: string) => {
    if (!email) return 'Anonymous';
    const [name, domain] = email.split('@');
    return `${name.substring(0, 2)}***@${domain}`;
  };

  const cardStyle = {
    backgroundColor: 'var(--card-bg, rgba(255, 252, 248, 0.94))',
    border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.12))',
    borderRadius: '24px',
    padding: '28px',
    marginBottom: '24px',
    boxShadow: '0 12px 32px -8px rgba(36, 24, 19, 0.08)',
    backdropFilter: 'blur(16px)',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(900px circle at 8% 8%, rgba(255, 215, 188, 0.45), transparent 60%), radial-gradient(700px circle at 92% 96%, hsla(21, 76%, 82%, 0.35), transparent 60%), linear-gradient(180deg, var(--surface, #fff7ef), var(--surface-warm, #f8e2cb) 65%, var(--surface-deep, #f3d1b3))',
      color: 'var(--ink, #241712)',
      fontFamily: 'var(--font-body), system-ui, sans-serif',
      padding: '100px 24px 60px'
    }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display), serif', fontSize: '32px', fontWeight: 700, color: 'var(--ink)' }}>Affiliate Dashboard</h1>
          <Link href="/dashboard" style={{
            color: 'var(--accent, #d9653b)',
            textDecoration: 'none',
            fontSize: '13.5px',
            fontWeight: 600,
            border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))',
            backgroundColor: 'rgba(255,255,255,0.85)',
            padding: '8px 16px',
            borderRadius: '999px',
            transition: 'background 0.2s'
          }}>
            &larr; Back to Dashboard
          </Link>
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '20px', marginTop: 0, marginBottom: '14px', color: 'var(--ink)' }}>Your Personal Referral Link</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              readOnly 
              value={referralLink}
              style={{
                flex: 1,
                minWidth: '240px',
                padding: '12px 16px',
                backgroundColor: '#fff',
                border: '1px solid var(--border-mid, rgba(26, 18, 14, 0.15))',
                borderRadius: '12px',
                color: 'var(--ink)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button 
              onClick={handleCopy}
              style={{
                background: 'linear-gradient(135deg, var(--accent, #d9653b), var(--accent-deep, #be4f27))',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                padding: '12px 24px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 6px 18px -3px rgba(217, 101, 59, 0.35)',
                transition: 'transform 0.2s'
              }}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Total Clicks', value: stats?.totalClicks || 0 },
            { label: 'Total Signups', value: stats?.totalRegistered || 0 },
            { label: 'Active Referrals', value: stats?.totalActive || 0 }
          ].map((stat, i) => (
            <div key={i} style={{ ...cardStyle, marginBottom: 0, textAlign: 'center' }}>
              <div style={{ color: 'var(--muted, rgba(36, 23, 18, 0.65))', fontSize: '13.5px', fontWeight: 600, marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontFamily: 'var(--font-display), serif', fontSize: '36px', fontWeight: 'bold', color: 'var(--accent, #d9653b)' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '20px', marginTop: 0, marginBottom: '18px', color: 'var(--ink)' }}>Recent Referrals</h2>
          {stats?.referrals && stats.referrals.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-mid, rgba(26, 18, 14, 0.12))', color: 'var(--muted)' }}>
                    <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: '13px' }}>User</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: '13px' }}>Status</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: '13px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.referrals.map((ref) => (
                    <tr key={ref._id} style={{ borderBottom: '1px solid var(--border-light, rgba(26, 18, 14, 0.06))' }}>
                      <td style={{ padding: '12px', fontSize: '14px', color: 'var(--ink)' }}>{maskEmail(ref.email)}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          backgroundColor: ref.status === 'active' ? 'rgba(44, 157, 111, 0.15)' : 'rgba(0,0,0,0.06)',
                          color: ref.status === 'active' ? '#2c9d6f' : 'var(--muted)',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}>
                          {ref.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {ref.createdAt ? new Date(ref.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px 0', fontSize: '14px' }}>
              No referrals yet. Share your link to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
