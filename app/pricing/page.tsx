'use client';

import Link from 'next/link';

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)' }}>
      <main style={{ padding: '110px 24px 60px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: '3rem', fontWeight: 700, color: '#1a120e', marginBottom: '16px' }}>Simple, Transparent Pricing</h1>
          <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '1.1rem', color: 'rgba(36,23,18,.58)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            Join Georgia&apos;s fastest-growing travel marketplace. No commissions, no hidden fees. Just one flat monthly rate.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '64px', paddingTop: '16px' }}>
          <div className="card-3d-glow" style={{ borderRadius: '28px', padding: '44px 40px 40px', background: 'rgba(255, 251, 246, 0.88)', border: '1px solid hsla(0,0%,100%,.45)', backdropFilter: 'blur(24px) saturate(120%)', boxShadow: '0 40px 80px rgba(48,26,16,0.12)', maxWidth: '400px', width: '100%', position: 'relative', overflow: 'visible', transformStyle: 'preserve-3d' }}>
            <span style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%) translateZ(30px)', zIndex: 20, fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 20px', borderRadius: '999px', background: 'linear-gradient(135deg, #d9653b, #b84e26)', color: '#fff', boxShadow: '0 6px 16px rgba(217,101,59,0.4)', whiteSpace: 'nowrap' }}>Most Popular</span>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: 'rgba(36,23,18,.58)', margin: '0 0 8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem' }}>Professional Host</p>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                <span style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: '1.5rem', color: '#1a120e' }}>₾</span>
                <span style={{ fontFamily: 'var(--font-display), serif', fontSize: '4rem', fontWeight: 700, color: '#1a120e', lineHeight: 1 }}>20</span>
                <span style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: 'rgba(36,23,18,.58)' }}>/month</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
              {[
                'Unlimited listings',
                '0% commission on bookings',
                'Direct contact with guests',
                'Verified host badge',
                '24/7 priority support',
                'AI-powered visibility boost'
              ].map((feat) => (
                <li key={feat} style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: '#1a120e', padding: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(36,23,18,.06)', fontSize: '0.92rem' }}>
                  <span style={{ color: '#d9653b', fontWeight: 800 }}>✓</span> {feat}
                </li>
              ))}
            </ul>
            <Link href="/business/register" style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--font-body), system-ui, sans-serif', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', background: 'linear-gradient(135deg, #d9653b, #b84e26)', color: '#fff', textDecoration: 'none', fontSize: '0.95rem', boxShadow: '0 8px 20px rgba(217,101,59,0.35)', transition: 'all 0.25s ease' }}>
              Get Started Now
            </Link>
          </div>
        </div>

        <div style={{ borderRadius: '28px', padding: '40px', background: 'rgba(255, 251, 246, 0.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', boxShadow: '0 40px 80px rgba(48,26,16,0.12)' }}>
          <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.6rem', fontWeight: 700, color: '#1a120e', textAlign: 'center', marginBottom: '32px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {[
              { q: 'Why is there no commission?', a: 'We believe in a fair marketplace. By charging a flat monthly fee, we allow you to keep 100% of your earnings and maintain lower prices for guests.' },
              { q: 'Can I cancel anytime?', a: 'Yes, there are no long-term contracts. You can pause or cancel your subscription at any time directly from your host dashboard.' },
              { q: 'How do I pay?', a: 'We support all major Georgian banks, Apple Pay, and credit cards. Payments are securely processed via Stripe.' },
              { q: 'What if I have 100+ listings?', a: 'The price remains the same! Whether you have one guest house or a chain of hotels, it\'s still just ₾20/month per host account.' }
            ].map((faq) => (
              <div key={faq.q} style={{ padding: '16px 0' }}>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.05rem', fontWeight: 600, color: '#1a120e', margin: '0 0 8px' }}>{faq.q}</h3>
                <p style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', color: 'rgba(36,23,18,.58)', lineHeight: 1.6, margin: 0, fontSize: '0.9rem' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Inline footer */}
      <footer className="site-footer">
        <div className="footer-grid shell">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="brandmark-dot"></span>
              <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
            </div>
            <p className="footer-tagline">Discover Georgia, your way.</p>
          </div>
          <div className="footer-links">
            <h4>Stays</h4>
            <Link href="/hotels">Hotels</Link>
            <Link href="/apartments">Apartments</Link>
            <Link href="/search?type=guesthouses">Guesthouses</Link>
            <Link href="/search?type=cabins">Cabins</Link>
          </div>
          <div className="footer-links">
            <h4>Discover</h4>
            <Link href="/muse">Where to go</Link>
            <Link href="/blog">Travel blog</Link>
            <Link href="/about">About us</Link>
            <Link href="/careers">Careers</Link>
          </div>
          <div className="footer-links">
            <h4>Support</h4>
            <Link href="/contact">Contact us</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/resources">Resources</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Kaya.ge &mdash; crafted in Tbilisi</span>
        </div>
      </footer>
    </div>
  );
}
