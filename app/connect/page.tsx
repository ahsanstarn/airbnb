'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/lang-context';

const LANG_FLAGS: Record<string, string> = { EN: '🇬🇧', KA: '🇬🇪', RU: '🇷🇺' };
const LANGS = ['EN', 'KA', 'RU'] as const;

const travelers = [
  { id: 't1', name: 'Anna K.', from: 'Germany', avatar: 'AK', interests: ['hiking', 'wine', 'photography'], bio: 'Here for 2 weeks, looking for hiking buddies in Kazbegi!' },
  { id: 't2', name: 'Marcus L.', from: 'USA', avatar: 'ML', interests: ['food', 'history', 'culture'], bio: 'Food writer exploring Georgian cuisine. Let\'s explore restaurants together.' },
  { id: 't3', name: 'Yuki T.', from: 'Japan', avatar: 'YT', interests: ['photography', 'wine', 'art'], bio: 'Photographer documenting qvevri winemaking. Happy to exchange skills!' },
  { id: 't4', name: 'Sofia R.', from: 'Italy', avatar: 'SR', interests: ['hiking', 'nature', 'camping'], bio: 'Nature lover planning to trek Svaneti. Looking for a small group.' },
  { id: 't5', name: 'Davit G.', from: 'Georgia', avatar: 'DG', interests: ['food', 'history', 'music'], bio: 'Local guide off-duty. Happy to show hidden gems over coffee.' },
  { id: 't6', name: 'Emma W.', from: 'UK', avatar: 'EW', interests: ['yoga', 'wellness', 'cooking'], bio: 'Yoga teacher planning a wellness retreat. Seeking collaborators.' },
];

const groups = [
  { id: 'g1', name: 'Tbilisi Foodies', members: 234, desc: 'Discover the best restaurants, bakeries, and hidden kitchens in Tbilisi', active: true },
  { id: 'g2', name: 'Kazbegi Hikers', members: 89, desc: 'Organize group hikes to Gergeti, Juta Valley, and Truso', active: true },
  { id: 'g3', name: 'Wine Lovers Kakheti', members: 156, desc: 'Qvevri wine tours, tastings, and vineyard stays', active: true },
  { id: 'g4', name: 'Digital Nomads Georgia', members: 312, desc: 'Coworking, cafés, and networking for remote workers', active: true },
];

export default function ConnectPage() {
  const { lang, setLang, t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('explore');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    const t = localStorage.getItem('kaya_token');
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch('/api/connect/conversations', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setConversations(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [token]);

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
            <Link href={token ? '/dashboard' : '/login'}>{token ? 'Dashboard' : 'Login'}</Link></div>
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

      <section style={{ padding: '120px 24px 40px', textAlign: 'center' }}>
        <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🤝</span>
        <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 700, margin: '0 0 8px' }}>{t('connect.title')}</h1>
        <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>{t('connect.subtitle')}</p>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 32px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { key: 'explore', label: '🌍 ' + t('connect.explore') },
          { key: 'groups', label: '👥 ' + t('connect.groups') },
          { key: 'messages', label: '💬 ' + t('connect.messages') },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '10px 20px', borderRadius: '999px', border: '0', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
            background: activeTab === tab.key ? '#1a120e' : 'rgba(255,251,246,.7)', color: activeTab === tab.key ? '#fff8ef' : 'var(--muted)',
            transition: 'all .25s',
          }}>{tab.label}</button>
        ))}
        {!token && (
          <Link href="/login" style={{ marginLeft: 'auto', padding: '10px 20px', borderRadius: '999px', border: '1px solid rgba(36,23,18,.14)', background: 'transparent', fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textDecoration: 'none' }}>Login to message</Link>
        )}
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 60px' }}>
        {activeTab === 'explore' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {travelers.map(t => (
              <div key={t.id} style={{ ...glass, padding: '24px', transition: 'all .25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#b87a55', display: 'grid', placeItems: 'center', fontSize: '16px', fontWeight: 800, color: '#fff8ef' }}>{t.avatar}</div>
                  <div>
                    <strong style={{ fontSize: '14px', display: 'block' }}>{t.name}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>📍 {t.from}</span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'rgba(36,23,18,.65)', margin: '0 0 12px' }}>{t.bio}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {t.interests.map(i => <span key={i} style={{ padding: '4px 10px', borderRadius: '999px', background: 'rgba(26,18,14,.06)', fontSize: '11px', fontWeight: 600 }}>{i}</span>)}
                </div>
                <button onClick={() => { if (!token) { router.push('/login'); } }} style={{ width: '100%', marginTop: '14px', padding: '10px', borderRadius: '999px', border: '0', background: '#1a120e', color: '#fff8ef', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Say Hello</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'groups' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {groups.map(g => (
              <div key={g.id} style={{ ...glass, padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{g.name}</h3>
                  {g.active && <span style={{ padding: '3px 8px', borderRadius: '999px', background: 'rgba(34,197,94,.15)', color: '#22c55e', fontSize: '10px', fontWeight: 700 }}>Active</span>}
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(36,23,18,.65)', margin: '0 0 12px', lineHeight: 1.5 }}>{g.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>👥 {g.members} members</span>
                  <button style={{ padding: '8px 16px', borderRadius: '999px', border: '1px solid rgba(26,18,14,.1)', background: 'rgba(255,251,246,.7)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Join</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div style={{ ...glass, padding: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 20px' }}>{t('connect.messages')}</h2>
            {!token ? (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px', fontSize: '13px' }}>Login to see your messages. <Link href="/login" style={{ color: 'var(--ink)', fontWeight: 700 }}>Sign in</Link></p>
            ) : conversations.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {conversations.map((c: any, i: number) => (
                  <div key={c.id || i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '14px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)', cursor: 'pointer', transition: 'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,252,247,1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,252,247,.9)'; }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#8855b8', display: 'grid', placeItems: 'center', fontSize: '14px', fontWeight: 800, color: '#fff8ef', flexShrink: 0 }}>{(c.other_user_id || '?')[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: '13px', display: 'block' }}>User {c.other_user_id?.slice(0, 8) || 'Unknown'}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.text}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', flexShrink: 0 }}>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px', fontSize: '13px' }}>No conversations yet. Start by saying hello to a traveler!</p>
            )}
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
