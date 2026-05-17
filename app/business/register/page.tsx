'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BusinessRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [form, setForm] = useState({
    businessName: '', category: 'hotels', description: '', address: '', city: 'Tbilisi',
    phone: '', website: '', contactName: '', contactEmail: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('kaya_token');
    if (!token) { router.push('/login'); }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('kaya_token');
    if (!token) { router.push('/login'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/business/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        setError(err.error || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nav = (
    <>
      <div className="sticky-nav-shell visible" style={{ top: '54px', transform: 'translateX(-50%)' }}>
        <nav className="nav nav-sticky-bar" style={{ transform: 'scale(1.08)' }}>
          <Link href="/" className="nav-brand"><span className="brandmark-dot"></span><span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span></Link>
          <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu"><span></span><span></span><span></span></button>
          <div className="nav-links"><Link href="/klara">KLARA</Link><Link href="/search">Visitors</Link><Link href="/hotels">Stays</Link><Link href="/muse">Where to go</Link><Link href="/contact">Contact us</Link></div>
          <div className="nav-spacer"></div>
        </nav>
      </div>
      <div className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}>
        <button className="mobile-nav-overlay-close" onClick={() => setMobileNavOpen(false)}>✕</button>
        <Link href="/klara" onClick={() => setMobileNavOpen(false)}>KLARA</Link>
        <Link href="/search" onClick={() => setMobileNavOpen(false)}>Visitors</Link>
        <Link href="/hotels" onClick={() => setMobileNavOpen(false)}>Stays</Link>
        <Link href="/muse" onClick={() => setMobileNavOpen(false)}>Where to go</Link>
        <Link href="/contact" onClick={() => setMobileNavOpen(false)}>Contact us</Link>
      </div>
    </>
  );

  const glass = { borderRadius: '24px', padding: '40px 36px', background: 'rgba(255,251,246,.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', boxShadow: '0 40px 80px rgba(48,26,16,0.12)', maxWidth: '600px', width: '100%' };

  const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #f8f1ea, #efe3d6, #f5ece3, #fdf7f0)' }}>
        {nav}
        <div style={glass}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#22c55e', display: 'grid', placeItems: 'center', margin: '0 auto 20px', fontSize: '28px', color: '#fff8ef' }}>✓</div>
            <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 8px' }}>Application Submitted</h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}>We&apos;ll review your business and get back to you within 24–48 hours. You&apos;ll receive a confirmation email once verified.</p>
            <Link href="/business/dashboard" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: '999px', background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>Go to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #f8f1ea, #efe3d6, #f5ece3, #fdf7f0)' }}>
      {nav}
      <div style={glass}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontFamily: 'var(--font-display), serif', fontWeight: 700, color: 'var(--ink)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ink)', boxShadow: '0 0 0 4px rgba(26,18,14,.08)' }}></span>
            kaya<span style={{ opacity: 0.5 }}>.ge</span>
          </Link>
          <p style={{ margin: '12px 0 0', color: 'var(--muted)', fontSize: '13px' }}>List your business on Kaya.ge</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ width: '32px', height: '4px', borderRadius: '2px', background: step >= s ? '#1a120e' : 'rgba(26,18,14,.1)', transition: 'all .3s' }} />
          ))}
        </div>

        {error && <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', color: '#dc2626', fontSize: '12px', fontWeight: 600, marginBottom: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 20px' }}>Business Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Business Name</label>
                  <input required value={form.businessName} onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))} placeholder="e.g. Nino's Guesthouse" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
                    <option value="hotels">Hotel / Guesthouse</option>
                    <option value="restaurants">Restaurant / Cafe</option>
                    <option value="cars">Car Rental</option>
                    <option value="tours">Tour Operator</option>
                    <option value="services">Service Provider</option>
                    <option value="salons">Salon / Spa</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Tell guests about your business..." rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} style={{ width: '100%', marginTop: '24px', padding: '14px', borderRadius: '999px', border: '0', background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Continue</button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 20px' }}>Location & Contact</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Address</label>
                  <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Street, district, landmark" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>City</label>
                  <select value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} style={inputStyle}>
                    {['Tbilisi', 'Batumi', 'Kutaisi', 'Kazbegi', 'Sighnaghi', 'Mestia', 'Telavi', 'Borjomi', 'Gori', 'Zugdidi'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Phone Number</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+995 555 XX XX XX" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Website (optional)</label>
                  <input type="url" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', borderRadius: '999px', border: '1px solid rgba(36,23,18,.14)', background: 'transparent', color: 'var(--muted)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                <button type="button" onClick={() => setStep(3)} style={{ flex: 1, padding: '14px', borderRadius: '999px', border: '0', background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Continue</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 20px' }}>Verification & Submit</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Contact Person Name</label>
                  <input required value={form.contactName} onChange={e => setForm(p => ({ ...p, contactName: e.target.value }))} placeholder="Full name" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Contact Email</label>
                  <input type="email" required value={form.contactEmail} onChange={e => setForm(p => ({ ...p, contactEmail: e.target.value }))} placeholder="business@example.com" style={inputStyle} />
                </div>
                <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(236,198,166,.2)', fontSize: '12px', color: '#7a4530', lineHeight: 1.6 }}>
                  By submitting, you agree to Kaya.ge&apos;s <Link href="/terms" style={{ fontWeight: 700, color: '#7a4530' }}>Terms of Service</Link>. Your business will be reviewed before going live. The 20 GEL/month subscription fee applies after verification.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: '14px', borderRadius: '999px', border: '1px solid rgba(36,23,18,.14)', background: 'transparent', color: 'var(--muted)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '14px', borderRadius: '999px', border: '0', background: submitting ? 'rgba(26,18,14,.6)' : '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                  {submitting ? 'Submitting…' : 'Submit Application'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
