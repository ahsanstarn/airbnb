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
    return <div style={{ color: 'var(--fg)', padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  const referralLink = stats?.affiliateCode 
    ? `https://kaya.ge?ref=${stats.affiliateCode}` 
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg, #0e0e10)',
      color: 'var(--fg, #f5f5f5)',
      fontFamily: 'var(--font-body, inherit)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>Affiliate Dashboard</h1>
          <Link href="/dashboard" style={{
            color: 'var(--accent, #E8604C)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '0.5rem 1rem',
            borderRadius: '8px'
          }}>
            &larr; Back to Dashboard
          </Link>
        </div>

        <div style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '1rem', color: '#ccc' }}>Your Referral Link</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              readOnly 
              value={referralLink}
              style={{
                flex: 1,
                padding: '0.8rem 1rem',
                backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button 
              onClick={handleCopy}
              style={{
                backgroundColor: 'var(--accent, #E8604C)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Total Clicks', value: stats?.totalClicks || 0 },
            { label: 'Total Signups', value: stats?.totalRegistered || 0 },
            { label: 'Active Referrals', value: stats?.totalActive || 0 }
          ].map((stat, i) => (
            <div key={i} style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent, #E8604C)' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '1.5rem',
          overflowX: 'auto'
        }}>
          <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '1.5rem', color: '#ccc' }}>Recent Referrals</h2>
          {stats?.referrals && stats.referrals.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#aaa' }}>
                  <th style={{ padding: '0.75rem 0', fontWeight: 'normal' }}>User</th>
                  <th style={{ padding: '0.75rem 0', fontWeight: 'normal' }}>Status</th>
                  <th style={{ padding: '0.75rem 0', fontWeight: 'normal' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.referrals.map((ref) => (
                  <tr key={ref._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 0' }}>{maskEmail(ref.email)}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{
                        backgroundColor: ref.status === 'active' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255,255,255,0.05)',
                        color: ref.status === 'active' ? '#4caf50' : '#ccc',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        textTransform: 'capitalize'
                      }}>
                        {ref.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0', color: '#888' }}>
                      {ref.createdAt ? new Date(ref.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>
              No referrals yet. Share your link to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
