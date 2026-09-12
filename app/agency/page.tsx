'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LANGUAGES = [
  { code: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'KA', label: 'ქართული', flag: '🇬🇪' },
  { code: 'RU', label: 'Русский', flag: '🇷🇺' },
];

export default function AgencyPage() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', details: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  useEffect(() => {
    fetch('/api/agency/services').then(r => r.json()).then(setServices).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('kaya_token')) : null;
      const res = await fetch('/api/agency/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ service_type: selectedService.title, details: form.details }),
      });
      if (res.ok) setSubmitted(true);
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  const glass = { borderRadius: '20px', background: 'rgba(255,251,246,.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)', paddingTop: '80px' }}>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&h=900&fit=crop) 50%/cover', opacity: 0.08 }} />
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <span style={{ fontSize: '44px', display: 'block', marginBottom: '12px' }}>🚀</span>
          <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, margin: '0 0 8px' }}>Kaya Agency</h1>
          <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>Digital services for Georgia&apos;s tourism businesses. Social media, photography, web design, content, and branding — we help your business shine online.</p>
        </div>
      </section>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 60px' }}>
        {selectedService ? (
          <div style={{ ...glass, padding: '36px', maxWidth: '700px', margin: '0 auto' }}>
            <button onClick={() => setSelectedService(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--muted)', marginBottom: '20px', display: 'block' }}>← All services</button>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{selectedService.icon}</div>
            <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px' }}>{selectedService.title}</h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '12px' }}>{selectedService.description}</p>
            <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>{selectedService.price}</div>

            <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>What&apos;s included:</h3>
            <ul style={{ margin: '0 0 24px', padding: '0 0 0 18px', fontSize: '13px', color: 'var(--muted)', lineHeight: 2 }}>
              {selectedService.deliverables?.map((d: string, i: number) => <li key={i}>{d}</li>)}
            </ul>

            {submitted ? (
              <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(34,197,94,.1)', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#22c55e' }}>✓ Request submitted! We&apos;ll be in touch within 24 hours.</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,.08)', fontSize: '14px', background: 'rgba(255,251,246,.5)', outline: 'none', boxSizing: 'border-box' }} />
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Your email" required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,.08)', fontSize: '14px', background: 'rgba(255,251,246,.5)', outline: 'none', boxSizing: 'border-box' }} />
                <textarea value={form.details} onChange={e => setForm(p => ({ ...p, details: e.target.value }))} placeholder="Tell us about your project..." rows={4} required style={{ display: 'block', width: '100%', marginBottom: '14px', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,.08)', fontSize: '14px', background: 'rgba(255,251,246,.5)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '0', background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>{submitting ? 'Sending...' : 'Send Request'}</button>
              </form>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {services.map(s => (
              <div key={s.id} onClick={() => setSelectedService(s)} style={{ ...glass, padding: '24px', cursor: 'pointer', transition: 'transform .2s' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.15rem', fontWeight: 700, margin: '0 0 6px' }}>{s.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>{s.price}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Learn more →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
