'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/lang-context';

const LANG_FLAGS: Record<string, string> = { EN: '🇬🇧', KA: '🇬🇪', RU: '🇷🇺' };
const LANGS = ['EN', 'KA', 'RU'] as const;

const categories = [
  { key: 'all', labelKey: 'gm.all', icon: '✨' },
  { key: 'wine', label: 'Wine & Spirits', icon: '🍷' },
  { key: 'food', label: 'Cooking & Food', icon: '🍳' },
  { key: 'adventure', label: 'Adventure', icon: '🏔️' },
  { key: 'culture', label: 'Culture & Arts', icon: '🎭' },
  { key: 'wellness', label: 'Wellness', icon: '🧖' },
  { key: 'crafts', label: 'Crafts', icon: '🎨' },
];

export default function GeorgianMoment() {
  const { lang, setLang, t } = useLang();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch('/api/georgian-moment').then(r => r.json()).then(setExperiences).catch(() => {});
  }, []);

  const filtered = activeCategory === 'all' ? experiences : experiences.filter(e => e.category === activeCategory);

  const nav = (
    <>
      <div className="sticky-nav-shell visible" style={{ top: '54px', transform: 'translateX(-50%)' }}>
        <nav className="nav nav-sticky-bar" style={{ transform: 'scale(1.08)' }}>
          <Link href="/" className="nav-brand"><span className="brandmark-dot"></span><span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span></Link>
          <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu"><span></span><span></span><span></span></button>
          <div className="nav-links"><Link href="/klara">{t('nav.klara')}</Link><Link href="/search">{t('nav.visitors')}</Link><Link href="/hotels">{t('nav.stays')}</Link><Link href="/muse">{t('nav.guide')}</Link><Link href="/contact">{t('nav.contact')}</Link></div>
          <div className="nav-spacer"></div>
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setLangOpen(!langOpen)} style={{ padding: '6px 12px', borderRadius: '999px', border: '1px solid rgba(36,23,18,.14)', background: 'rgba(255,251,246,.7)', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>{lang}</button>
              {langOpen && <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '6px', padding: '6px', borderRadius: '14px', background: 'rgba(255,251,246,.96)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px)', boxShadow: '0 8px 24px rgba(0,0,0,.08)', zIndex: 100, minWidth: '140px' }}>{LANGS.map(code => (
                <button key={code} onClick={() => { setLang(code); setLangOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', borderRadius: '10px', border: '0', background: lang === code ? 'rgba(26,18,14,.06)' : 'transparent', cursor: 'pointer', fontSize: '12px', fontWeight: lang === code ? 700 : 500, textAlign: 'left' }}><span>{LANG_FLAGS[code]}</span> {t(`lang.${code.toLowerCase()}`)} {lang === code && <span style={{ marginLeft: 'auto', fontSize: '11px' }}>✓</span>}</button>
              ))}</div>}
            </div>
            <Link href="/login">{t('nav.becomeHost')}</Link></div>
        </nav>
      </div>
      <div className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}>
        <button className="mobile-nav-overlay-close" onClick={() => setMobileNavOpen(false)}>✕</button>
        <Link href="/klara" onClick={() => setMobileNavOpen(false)}>{t('nav.klara')}</Link>
        <Link href="/search" onClick={() => setMobileNavOpen(false)}>{t('nav.visitors')}</Link>
        <Link href="/hotels" onClick={() => setMobileNavOpen(false)}>{t('nav.stays')}</Link>
        <Link href="/muse" onClick={() => setMobileNavOpen(false)}>{t('nav.guide')}</Link>
        <Link href="/contact" onClick={() => setMobileNavOpen(false)}>{t('nav.contact')}</Link>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', margin: '8px 0', padding: '8px 0' }}>{LANGS.map(code => (
          <button key={code} onClick={() => { setLang(code); setMobileNavOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 24px', border: '0', background: 'transparent', color: '#fff8ef', fontSize: '14px', fontWeight: lang === code ? 700 : 400, cursor: 'pointer', textAlign: 'left' }}>{LANG_FLAGS[code]} {t(`lang.${code.toLowerCase()}`)} {lang === code && ' ✓'}</button>
        ))}</div>
      </div>
    </>
  );

  const glass = { borderRadius: '20px', background: 'rgba(255,251,246,.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)' }}>
      {nav}
      
      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 80px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1600&h=900&fit=crop) 50%/cover', opacity: 0.15 }} />
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>✨</span>
          <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, margin: '0 0 12px' }}>{t('gm.title')}</h1>
          <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 8px' }}>{t('gm.subtitle')}</p>
          <p style={{ fontSize: '14px', color: 'rgba(36,23,18,.45)', fontStyle: 'italic', margin: 0 }}>Wine workshops · Cooking classes · Mountain hikes · Craft sessions</p>
        </div>
      </section>

      {/* Category filter */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 32px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {categories.map(c => (
          <button key={c.key} onClick={() => setActiveCategory(c.key)} style={{
            padding: '10px 20px', borderRadius: '999px', border: '0', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
            background: activeCategory === c.key ? '#1a120e' : 'rgba(255,251,246,.7)', color: activeCategory === c.key ? '#fff8ef' : 'var(--muted)',
            transition: 'all .25s', boxShadow: activeCategory === c.key ? '0 4px 12px rgba(26,18,14,.15)' : 'none',
          }}>{c.icon} {c.labelKey ? t(c.labelKey) : c.label}</button>
        ))}
      </div>

      {/* Experiences grid */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 60px' }}>
        {selected ? (
          <div style={{ ...glass, padding: '36px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--muted)', marginBottom: '20px', display: 'block' }}>← {t('gm.all')}</button>
            <div style={{ width: '100%', height: '320px', borderRadius: '16px', background: `url(${selected.image}) 50%/cover`, marginBottom: '24px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 4px' }}>{selected.title}</h2>
                <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>{selected.subtitle}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '22px', fontWeight: 800 }}>₾{selected.price}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>per person</div>
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(36,23,18,.7)', margin: '0 0 20px' }}>{selected.description}</p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '12px', fontWeight: 600 }}>⏱ {selected.duration}</span>
              <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '12px', fontWeight: 600 }}>📍 {selected.location}</span>
              <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '12px', fontWeight: 600 }}>★ {selected.rating} ({selected.reviews} reviews)</span>
            </div>
            <div style={{ ...glass, padding: '20px', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '.08em' }}>{t('agency.whatsIncluded')}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selected.included?.map((item: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(36,23,18,.7)' }}>
                    <span style={{ color: '#22c55e', fontSize: '14px' }}>✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
            <button style={{ width: '100%', padding: '16px', borderRadius: '999px', border: '0', background: '#1a120e', color: '#fff8ef', fontSize: '15px', fontWeight: 800, cursor: 'pointer' }}>{t('gm.book')} — ₾{selected.price}</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filtered.map(exp => (
              <button key={exp.id} onClick={() => setSelected(exp)} style={{ ...glass, padding: '0', overflow: 'hidden', cursor: 'pointer', border: 'none', textAlign: 'left', width: '100%', display: 'block', transition: 'all .25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: '100%', height: '200px', background: `url(${exp.image}) 50%/cover` }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{exp.title}</h3>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{exp.subtitle}</span>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                      <div style={{ fontWeight: 800, fontSize: '17px' }}>₾{exp.price}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(36,23,18,.6)', margin: '0 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{exp.description}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '11px', fontWeight: 600 }}>⏱ {exp.duration}</span>
                    <span style={{ padding: '4px 10px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '11px', fontWeight: 600 }}>★ {exp.rating}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* How it works */}
      {!selected && (
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ ...glass, padding: '48px 36px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 32px' }}>How {t('gm.title')} Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {[
                { step: '1', title: 'Choose', desc: 'Browse authentic experiences hosted by Georgian locals' },
                { step: '2', title: 'Book', desc: 'Reserve instantly — pay online or in person' },
                { step: '3', title: 'Experience', desc: 'Show up and let your local host take care of everything' },
                { step: '4', title: 'Remember', desc: 'Leave with stories, skills, and a piece of Georgia' },
              ].map(s => (
                <div key={s.step}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#1a120e', color: '#fff8ef', display: 'grid', placeItems: 'center', fontSize: '20px', fontWeight: 800, margin: '0 auto 12px' }}>{s.step}</div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>{s.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand"><div className="footer-logo"><span className="brandmark-dot"></span><span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span></div><p className="footer-tagline">{t('footer.tagline')}</p></div>
          <div className="footer-links"><h4>{t('footer.stays')}</h4><Link href="/hotels">{t('footer.hotels')}</Link><Link href="/apartments">{t('footer.apartments')}</Link><Link href="/search?type=guesthouses">{t('footer.guesthouses')}</Link><Link href="/search?type=cabins">{t('footer.cabins')}</Link></div>
          <div className="footer-links"><h4>{t('footer.discover')}</h4><Link href="/muse">{t('footer.whereToGo')}</Link><Link href="/georgian-table">{t('footer.georgianTable')}</Link><Link href="/georgian-moment">{t('footer.georgianMoment')}</Link><Link href="/trip-planner">{t('footer.tripPlanner')}</Link></div>
          <div className="footer-links"><h4>{t('footer.support')}</h4><Link href="/contact">{t('footer.contact')}</Link><Link href="/privacy">{t('footer.privacy')}</Link><Link href="/terms">{t('footer.terms')}</Link><Link href="/resources">{t('footer.resources')}</Link></div>
        </div>
        <div className="footer-bottom"><span>&copy; {new Date().getFullYear()} Kaya.ge &mdash; {t('footer.copyright')}</span></div>
      </footer>
    </div>
  );
}
