'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/lang-context';

const LANG_FLAGS: Record<string, string> = { EN: '🇬🇧', KA: '🇬🇪', RU: '🇷🇺' };
const LANGS = ['EN', 'KA', 'RU'] as const;

export default function GeorgianTable() {
  const { lang, setLang, t } = useLanguage();
  const [data, setData] = useState<{ restaurants: any[]; dishes: any[] }>({ restaurants: [], dishes: [] });
  const [activeTab, setActiveTab] = useState<'restaurants' | 'dishes'>('restaurants');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);

  useEffect(() => {
    fetch('/api/georgian-table').then(r => r.json()).then(setData).catch(() => {});
  }, []);

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
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&h=900&fit=crop) 50%/cover', opacity: 0.1 }} />
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <span style={{ fontSize: '44px', display: 'block', marginBottom: '12px' }}>🍽️</span>
          <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, margin: '0 0 8px' }}>{t('gt.title')}</h1>
          <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>{t('gt.subtitle')}</p>
        </div>
      </section>

      {/* Tab toggle */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 32px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {[
          { key: 'restaurants', label: '🍽️ ' + t('gt.restaurants') },
          { key: 'dishes', label: '🍲 ' + t('gt.dishes') },
        ].map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key as any); setSelectedRestaurant(null); }} style={{
            padding: '10px 24px', borderRadius: '999px', border: '0', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
            background: activeTab === tab.key ? '#1a120e' : 'rgba(255,251,246,.7)', color: activeTab === tab.key ? '#fff8ef' : 'var(--muted)',
            transition: 'all .25s',
          }}>{tab.label}</button>
        ))}
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 60px' }}>
        {activeTab === 'restaurants' && (
          selectedRestaurant ? (
            <div style={{ ...glass, padding: '36px', maxWidth: '700px', margin: '0 auto' }}>
              <button onClick={() => setSelectedRestaurant(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--muted)', marginBottom: '20px', display: 'block' }}>← {t('gt.restaurants')}</button>
              <div style={{ width: '100%', height: '280px', borderRadius: '16px', background: `url(${selectedRestaurant.image}) 50%/cover`, marginBottom: '20px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 4px' }}>{selectedRestaurant.name}</h2>
                  <p style={{ fontSize: '14px', color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>{selectedRestaurant.subtitle}</p>
                </div>
                <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '14px', fontWeight: 700 }}>{selectedRestaurant.priceRange}</span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(36,23,18,.7)', margin: '0 0 16px' }}>{selectedRestaurant.description}</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '12px', fontWeight: 600 }}>📍 {selectedRestaurant.location}</span>
                <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '12px', fontWeight: 600 }}>★ {selectedRestaurant.rating} ({selectedRestaurant.reviews} reviews)</span>
                <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '12px', fontWeight: 600 }}>{selectedRestaurant.cuisine}</span>
              </div>
              <div style={{ ...glass, padding: '16px 20px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)' }}>Signature Dish</span>
                <p style={{ fontSize: '14px', fontWeight: 600, margin: '4px 0 0' }}>🍽️ {selectedRestaurant.signature}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {data.restaurants.map(r => (
                <button key={r.id} onClick={() => setSelectedRestaurant(r)} style={{ ...glass, padding: '0', overflow: 'hidden', cursor: 'pointer', border: 'none', textAlign: 'left', width: '100%', transition: 'all .25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ width: '100%', height: '180px', background: `url(${r.image}) 50%/cover` }} />
                  <div style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{r.name}</h3>
                      <span style={{ padding: '3px 8px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '11px', fontWeight: 700 }}>{r.priceRange}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 8px', fontStyle: 'italic' }}>{r.subtitle}</p>
                    <p style={{ fontSize: '13px', color: 'rgba(36,23,18,.6)', margin: '0 0 10px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.description}</p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '10px', fontWeight: 600 }}>★ {r.rating}</span>
                      <span style={{ padding: '3px 8px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '10px', fontWeight: 600 }}>{r.location}</span>
                      <span style={{ padding: '3px 8px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '10px', fontWeight: 600 }}>{r.cuisine}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )
        )}

        {activeTab === 'dishes' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {data.dishes.map((d, i) => (
              <div key={i} style={{ ...glass, padding: '0', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '160px', background: `url(${d.image}) 50%/cover` }} />
                <div style={{ padding: '18px' }}>
                  <h3 style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: 700 }}>{d.name}</h3>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>{d.type} · {d.region}</span>
                  <p style={{ fontSize: '13px', color: 'rgba(36,23,18,.65)', margin: '10px 0 0', lineHeight: 1.5 }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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
