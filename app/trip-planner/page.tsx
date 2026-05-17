'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LANGUAGES = [
  { code: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'KA', label: 'ქართული', flag: '🇬🇪' },
  { code: 'RU', label: 'Русский', flag: '🇷🇺' },
];

const moods = [
  { id: 'wine-food', emoji: '🍷', label: 'Wine & Food', desc: 'Culinary tours, wine tastings, cooking classes' },
  { id: 'adventure', emoji: '🏔️', label: 'Adventure', desc: 'Hiking, paragliding, skiing, mountain treks' },
  { id: 'culture', emoji: '🏛️', label: 'Culture & History', desc: 'Museums, monasteries, UNESCO sites, city walks' },
  { id: 'romance', emoji: '💕', label: 'Romance', desc: 'Scenic getaways, sunset spots, cozy retreats' },
  { id: 'nature', emoji: '🌿', label: 'Nature & Relaxation', desc: 'Hot springs, forests, lakes, peaceful escapes' },
  { id: 'mixed', emoji: '🎒', label: 'A Bit of Everything', desc: 'Best of Georgia for first-time visitors' },
];

export default function TripPlanner() {
  const [step, setStep] = useState<'mood' | 'details' | 'result'>('mood');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [duration, setDuration] = useState('3');
  const [budget, setBudget] = useState('mid');
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleGenerate = async () => {
    if (!selectedMood || !duration) return;
    setLoading(true);
    try {
      const res = await fetch('/api/trip-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, duration, budget }),
      });
      const data = await res.json();
      setItinerary(data.itinerary || 'Sorry, could not generate itinerary. Please try again.');
      setStep('result');
    } catch {
      setItinerary('Network error. Please try again.');
    } finally {
      setLoading(false);
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
          <div className="nav-right"><Link href="/login">Become a host</Link></div>
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

  const glass = { borderRadius: '20px', background: 'rgba(255,251,246,.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)' }}>
      {nav}

      <section style={{ padding: '120px 24px 40px', textAlign: 'center' }}>
        <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🧠</span>
        <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 700, margin: '0 0 8px' }}>Trip Mood AI Planner</h1>
        <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>Tell us your mood, how long you have, and your budget — we&apos;ll build a personalized Georgia itinerary.</p>
      </section>

      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={glass}>
          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
            {['mood', 'details', 'result'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '4px', borderRadius: '2px', background: step === s || (step === 'result' && ['mood','details','result'].indexOf(step) > i) ? '#1a120e' : 'rgba(26,18,14,.1)' }} />
              </div>
            ))}
          </div>

          {step === 'mood' && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>What&apos;s your travel mood?</h2>
              <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', margin: '0 0 24px' }}>Pick the vibe that matches what you&apos;re looking for.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {moods.map(m => (
                  <button key={m.id} onClick={() => setSelectedMood(m.id)} style={{
                    padding: '20px', borderRadius: '16px', border: selectedMood === m.id ? '2px solid #1a120e' : '1px solid rgba(26,18,14,.1)',
                    background: selectedMood === m.id ? 'rgba(26,18,14,.03)' : 'rgba(255,252,247,.9)', cursor: 'pointer', textAlign: 'left', transition: 'all .2s',
                  }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{m.emoji}</div>
                    <strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>{m.label}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{m.desc}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep('details')} disabled={!selectedMood} style={{
                width: '100%', marginTop: '20px', padding: '16px', borderRadius: '999px', border: '0',
                background: selectedMood ? '#1a120e' : 'rgba(26,18,14,.3)', color: '#fff8ef',
                fontSize: '15px', fontWeight: 800, cursor: selectedMood ? 'pointer' : 'not-allowed',
              }}>Continue</button>
            </>
          )}

          {step === 'details' && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 20px', textAlign: 'center' }}>Your trip details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>How many days?</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['1', '2', '3', '5', '7', '10'].map(d => (
                      <button key={d} onClick={() => setDuration(d)} style={{
                        flex: 1, padding: '14px', borderRadius: '12px', border: duration === d ? '2px solid #1a120e' : '1px solid rgba(26,18,14,.1)',
                        background: duration === d ? 'rgba(26,18,14,.03)' : 'rgba(255,252,247,.9)', cursor: 'pointer', fontWeight: duration === d ? 800 : 500, fontSize: '14px',
                      }}>{d}{parseInt(d) > 1 ? ' days' : ' day'}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Budget level</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                      { key: 'low', label: '💵 Budget', desc: '₾40-80/night' },
                      { key: 'mid', label: '💰 Mid', desc: '₾80-200/night' },
                      { key: 'high', label: '💎 Luxury', desc: '₾200+/night' },
                    ].map(b => (
                      <button key={b.key} onClick={() => setBudget(b.key)} style={{
                        flex: 1, padding: '16px', borderRadius: '14px', border: budget === b.key ? '2px solid #1a120e' : '1px solid rgba(26,18,14,.1)',
                        background: budget === b.key ? 'rgba(26,18,14,.03)' : 'rgba(255,252,247,.9)', cursor: 'pointer', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>{b.label}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{b.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button onClick={() => setStep('mood')} style={{ flex: 1, padding: '14px', borderRadius: '999px', border: '1px solid rgba(36,23,18,.14)', background: 'transparent', color: 'var(--muted)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                <button onClick={handleGenerate} disabled={loading} style={{
                  flex: 1, padding: '14px', borderRadius: '999px', border: '0',
                  background: loading ? 'rgba(26,18,14,.6)' : '#1a120e', color: '#fff8ef',
                  fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                }}>{loading ? '🧠 Planning…' : '✨ Generate My Trip'}</button>
              </div>
            </>
          )}

          {step === 'result' && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 16px', textAlign: 'center' }}>Your Personalized Itinerary</h2>
              <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)', marginBottom: '20px', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {itinerary.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { setStep('mood'); setItinerary(''); }} style={{ flex: 1, padding: '14px', borderRadius: '999px', border: '1px solid rgba(36,23,18,.14)', background: 'transparent', color: 'var(--muted)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Start Over</button>
                <Link href="/search" style={{ flex: 1, textAlign: 'center', padding: '14px', borderRadius: '999px', border: '0', background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>Browse Stays</Link>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand"><div className="footer-logo"><span className="brandmark-dot"></span><span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span></div><p className="footer-tagline">Discover Georgia, your way.</p></div>
          <div className="footer-links"><h4>Stays</h4><Link href="/hotels">Hotels</Link><Link href="/apartments">Apartments</Link><Link href="/search?type=guesthouses">Guesthouses</Link><Link href="/search?type=cabins">Cabins</Link></div>
          <div className="footer-links"><h4>Discover</h4><Link href="/muse">Where to go</Link><Link href="/georgian-table">Georgian Table</Link><Link href="/georgian-moment">Georgian Moment</Link><Link href="/trip-planner">Trip Planner</Link></div>
          <div className="footer-links"><h4>Support</h4><Link href="/contact">Contact us</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/resources">Resources</Link></div>
        </div>
        <div className="footer-bottom"><span>&copy; {new Date().getFullYear()} Kaya.ge &mdash; crafted in Tbilisi</span></div>
      </footer>
    </div>
  );
}
