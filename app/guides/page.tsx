'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface RegionGuide {
  id: string;
  name: string;
  tagline: string;
  desc: string;
  img: string;
  bestSeason: string;
  highlights: string[];
  listingsCount: number;
  category: string;
  link: string;
}

interface LocalTip {
  id: string;
  category: string;
  title: string;
  summary: string;
  details: string;
  icon: string;
}

interface Phrase {
  ka: string;
  en: string;
  pronounce: string;
  meaning: string;
  category: string;
}

interface VettedGuide {
  id: string;
  name: string;
  role: string;
  region: string;
  languages: string[];
  rating: number;
  tripsCount: number;
  avatar: string;
  specialty: string;
}

const REGION_GUIDES: RegionGuide[] = [
  {
    id: 'tbilisi',
    name: 'Tbilisi & Surroundings',
    tagline: 'Bohemian Balconies, Sulfur Spas & Contemporary Art',
    desc: 'Georgia’s 1,500-year-old capital harmonizes centuries-old Persian-style wooden balconies with avant-garde techno clubs, sulfur baths in Abanotubani, and the cobblestone courtyards of Sololaki.',
    img: '/destinations/tbilisi.jpg',
    bestSeason: 'Spring (Apr–Jun) & Autumn (Sep–Nov)',
    highlights: ['Abanotubani Sulfur Baths', 'Narikala Fortress', 'Sololaki Art Nouveau Courtyards', 'Fabrika Cultural Hub'],
    listingsCount: 420,
    category: 'city',
    link: '/hotels?city=tbilisi',
  },
  {
    id: 'kazbegi',
    name: 'Kazbegi & High Caucasus',
    tagline: 'Iconic Gergeti Trinity Church & 5,000m Glaciers',
    desc: 'The dramatic Georgian Military Highway winds through Jvari Pass to Stepantsminda, where Mount Kazbek towers at 5,054m above the legendary 14th-century Gergeti Trinity Church.',
    img: '/destinations/kazbegi.jpg',
    bestSeason: 'Summer (Jun–Sep) & Winter (Gudauri Ski Dec–Apr)',
    highlights: ['Gergeti Trinity Church', 'Truso Valley Travertine Springs', 'Gveleti Waterfalls', 'Gudauri Ski Slopes'],
    listingsCount: 180,
    category: 'mountains',
    link: '/hotels?city=kazbegi',
  },
  {
    id: 'kakheti',
    name: 'Kakheti Wine Heartland',
    tagline: '8,000 Vintages, Ancient Qvevri & The Alazani Valley',
    desc: 'The cradle of world winemaking. Experience family micro-cellars where amber wine ferments in underground clay vessels (Qvevri), ancient monasteries, and the romantic cobblestones of Sighnaghi.',
    img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=500&fit=crop',
    bestSeason: 'Autumn (Rtveli Harvest Sep–Oct) & Late Spring',
    highlights: ['Sighnaghi City of Love', 'Alaverdi Monastery Cellars', 'Tsinandali Chavchavadze Estate', 'Rtveli Grape Harvest'],
    listingsCount: 240,
    category: 'wine',
    link: '/georgian-table',
  },
  {
    id: 'svaneti',
    name: 'Svaneti & High Ushguli',
    tagline: 'Medieval Defense Towers & Glacial Alpine Treks',
    desc: 'One of the most remote alpine regions in Europe. Towering 12th-century stone watchtowers guard UNESCO villages beneath the jagged peaks of Mount Shkhara and Mount Ushba.',
    img: '/destinations/svaneti.jpg',
    bestSeason: 'Mid-June to late September',
    highlights: ['Ushguli UNESCO Village', 'Chalaadi Glacier Trail', 'Mestia Historical Museum', 'Koruldi Alpine Lakes'],
    listingsCount: 110,
    category: 'mountains',
    link: '/tours?region=svaneti',
  },
  {
    id: 'batumi',
    name: 'Batumi & Adjara Coast',
    tagline: 'Subtropical Palms, Modern Architecture & Black Sea Coast',
    desc: 'Where the Caucasus mountains touch the Black Sea. Stroll the 7km seaside boulevard, explore the world-renowned cliffside Botanical Gardens, and savor authentic boat-shaped Adjarian khachapuri.',
    img: '/destinations/batumi.jpg',
    bestSeason: 'June to late September',
    highlights: ['Batumi Boulevard', 'Cape Verde Botanical Garden', 'Mtirala National Park Rainforest', 'Old Batumi Piazza'],
    listingsCount: 290,
    category: 'coastal',
    link: '/hotels?city=batumi',
  },
  {
    id: 'kutaisi',
    name: 'Kutaisi & Imereti Canyons',
    tagline: 'Emerald River Canyons, Prehistoric Caves & Gelati',
    desc: 'The ancient kingdom of Colchis. Base yourself in Kutaisi to explore subterranean rivers at Prometheus Cave, take rubber boat trips through Martvili Canyon, and visit UNESCO Gelati Monastery.',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
    bestSeason: 'May to October',
    highlights: ['Martvili Emerald Canyon', 'Prometheus Subterranean Caves', 'Gelati Monastery', 'Okatse Hanging Canyon'],
    listingsCount: 135,
    category: 'nature',
    link: '/tours?region=kutaisi',
  },
];

const LOCAL_TIPS: LocalTip[] = [
  {
    id: 'payments',
    category: 'Finance',
    icon: '💳',
    title: 'Contactless Payments & Currency (GEL)',
    summary: 'Card and contactless phone payments are ubiquitous across Georgia.',
    details: 'The currency is the Georgian Lari (GEL / ₾). You can tap your card, Apple Pay, or Google Pay almost everywhere, from modern restaurants down to small corner bakeries and Tbilisi metro turnstiles. Keep 10–20 GEL cash in small bills only for mountain marshrutkas and roadside fruit stands. TBC Bank and Bank of Georgia ATMs are safe, reliable, and speak English.',
  },
  {
    id: 'connectivity',
    category: 'Tech',
    icon: '📶',
    title: 'SIM Cards & Mobile Internet (MagtiCom)',
    summary: 'Magti offers the strongest high-altitude 4G/5G coverage in the mountains.',
    details: 'You can pick up a physical SIM or eSIM at Tbilisi (TBS) or Kutaisi (KUT) airport arrivals. MagtiCom is the gold standard for travelers heading into Kazbegi, Svaneti, or Tusheti, providing 4G signal even on high alpine passes. Silknet is also excellent for cities. Unlimited weekly data packages typically cost less than ₾15–20 ($5–7 USD).',
  },
  {
    id: 'transport',
    category: 'Transit',
    icon: '🚙',
    title: 'Getting Around: Trains, Marshrutkas & 4x4s',
    summary: 'Use the fast train between Tbilisi and Batumi; hire 4x4s for mountain passes.',
    details: 'For intercity travel between Tbilisi, Kutaisi, and Batumi, the modern Swiss Stadler double-decker Georgian Railway train is fast, scenic, and costs around ₾35. For mountain roads like Mestia or Stepantsminda, shared marshrutka vans run from Didube station. However, for rough unpaved passes (Truso, Ushguli, Shatili), always hire a high-clearance 4x4 SUV (like a Toyota Land Cruiser or Mitsubishi Delica) with an experienced local driver.',
  },
  {
    id: 'supra',
    category: 'Culture',
    icon: '🍷',
    title: 'Georgian Feast (Supra) & Toasting Etiquette',
    summary: 'Every feast is directed by a Tamada. Never toast with beer.',
    details: 'A Georgian feast (Supra) is a sacred cultural ritual. The Tamada (toastmaster) leads philosophical toasts to peace, ancestors, homeland, and friendship. Always wait for the Tamada to finish before drinking, and clink glasses with fellow guests. Crucial rule: Georgians only toast with wine or cha-cha; toasting with beer is historically reserved for wishing misfortune on enemies!',
  },
  {
    id: 'safety',
    category: 'Safety',
    icon: '🛡️',
    title: 'Safety, Water Quality & Emergency 112',
    summary: 'Georgia ranks among the safest nations in Europe with pure alpine tap water.',
    details: 'Violent crime is practically nonexistent, and solo travelers (including solo female travelers) consistently report feeling safe at any hour. Tap water in Tbilisi and the mountain regions originates from natural Caucasus alpine springs and is clean and drinkable. Dial 112 for the unified emergency service with English and Russian speaking operators.',
  },
  {
    id: 'tipping',
    category: 'Dining',
    icon: '🍽️',
    title: 'Tipping & Service Charge Norms',
    summary: 'Most restaurant bills include 10–18% service; extra tips are warmly received.',
    details: 'Most sit-down cafes and restaurants in Tbilisi and Batumi automatically add a 10% to 18% service charge to the final bill. While this covers standard service, leaving an additional 5% to 10% in cash directly for the server is customary for attentive hospitality. For private mountain drivers and tour guides, ₾20–50 per day is standard.',
  },
];

const PHRASES: Phrase[] = [
  { ka: 'გამარჯობა', en: 'Gamarjoba', pronounce: 'gah-mahr-JOH-bah', meaning: 'Hello / Greetings (Lit: Victory to you)', category: 'Basics' },
  { ka: 'მადლობა', en: 'Madloba', pronounce: 'mahd-LOH-bah', meaning: 'Thank you', category: 'Basics' },
  { ka: 'დიდი მადლობა', en: 'Didi Madloba', pronounce: 'DEE-dee mahd-LOH-bah', meaning: 'Thank you very much', category: 'Basics' },
  { ka: 'გაუმარჯოს!', en: 'Gaumarjos!', pronounce: 'gah-oo-mahr-JHOHS', meaning: 'Cheers! / To victory! (The essential supra toast)', category: 'Dining' },
  { ka: 'ინებეთ / თუ შეიძლება', en: 'Tu sheidzleba', pronounce: 'too shey-dz-LEH-bah', meaning: 'Please / If possible', category: 'Basics' },
  { ka: 'ბოდიში', en: 'Bodishi', pronounce: 'boh-DEE-shee', meaning: 'Excuse me / Sorry', category: 'Basics' },
  { ka: 'რა ღირს?', en: 'Ra ghirs?', pronounce: 'rah gheers?', meaning: 'How much does this cost?', category: 'Shopping' },
  { ka: 'ძალიან გემრიელია!', en: 'Dzalian gemrielia!', pronounce: 'dzah-lee-AHN gem-ree-EH-lee-ah', meaning: 'This is absolutely delicious!', category: 'Dining' },
  { ka: 'ღვინო', en: 'Ghvino', pronounce: 'ghvee-NOH', meaning: 'Wine (The cradle word of English wine)', category: 'Dining' },
  { ka: 'წყალი', en: 'Tsqali', pronounce: 'TSQAH-lee', meaning: 'Water', category: 'Dining' },
  { ka: 'კი / არა', en: 'Ki / Ara', pronounce: 'kee / AH-rah', meaning: 'Yes / No', category: 'Basics' },
  { ka: 'ნახვამდის', en: 'Nakhvamdis', pronounce: 'nahkh-vahm-DEES', meaning: 'Goodbye / Until we meet again', category: 'Basics' },
];

const VETTED_GUIDES: VettedGuide[] = [
  {
    id: 'g-1',
    name: 'Tornike Kapanadze',
    role: 'Certified High-Alpine Mountaineer',
    region: 'Kazbegi & Svaneti',
    languages: ['EN', 'KA', 'RU'],
    rating: 4.98,
    tripsCount: 142,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    specialty: 'Gergeti Glacier Trekking, 4x4 Off-Road Expeditions',
  },
  {
    id: 'g-2',
    name: 'Nino Asatiani',
    role: 'Sommelier & Qvevri Heritage Historian',
    region: 'Kakheti Wine Country',
    languages: ['EN', 'KA', 'FR'],
    rating: 5.0,
    tripsCount: 188,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    specialty: 'Ancient Natural Wines, Village Supra Feast Hosting',
  },
  {
    id: 'g-3',
    name: 'Giorgi Beridze',
    role: 'Architectural Historian & City Guide',
    region: 'Tbilisi & Mtskheta',
    languages: ['EN', 'KA', 'DE'],
    rating: 4.95,
    tripsCount: 230,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    specialty: 'Sololaki Secret Courtyards, 19th-c. Silk Road Mansions',
  },
];

export default function GuidesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'regions' | 'tips' | 'phrasebook' | 'companions'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Filtered lists based on search query
  const filteredRegions = useMemo(() => {
    if (!searchQuery.trim()) return REGION_GUIDES;
    const q = searchQuery.toLowerCase();
    return REGION_GUIDES.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.tagline.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      r.highlights.some(h => h.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredTips = useMemo(() => {
    if (!searchQuery.trim()) return LOCAL_TIPS;
    const q = searchQuery.toLowerCase();
    return LOCAL_TIPS.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.details.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredPhrases = useMemo(() => {
    if (!searchQuery.trim()) return PHRASES;
    const q = searchQuery.toLowerCase();
    return PHRASES.filter(p =>
      p.en.toLowerCase().includes(q) ||
      p.ka.includes(q) ||
      p.pronounce.toLowerCase().includes(q) ||
      p.meaning.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const copyPhrase = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="site-shell">
      <div className="shell">
        <div className="homepage-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

          {/* Hero Header Section */}
          <header style={{ padding: '80px 24px 36px', maxWidth: '1100px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(217,101,59,0.08)', border: '1px solid rgba(217,101,59,0.22)', color: 'var(--accent, #d9653b)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px' }}>
              <span>🇬🇪</span>
              <span>Kaya Sakartvelo Insider</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 16px', color: 'var(--ink)' }}>
              The Essential Georgia Travel Guide
            </h1>
            <p style={{ maxWidth: '680px', margin: '0 auto 32px', fontSize: '16px', lineHeight: 1.6, color: 'var(--muted)' }}>
              Curated regional deep dives, high-mountain passes, local cultural etiquette, essential phrasebook, and certified Caucasian travel companions.
            </p>

            {/* Search Input Bar */}
            <div style={{ maxWidth: '520px', margin: '0 auto 28px', position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search regions, tips, SIM cards, wine, toasts, guides..."
                style={{
                  width: '100%',
                  padding: '14px 20px 14px 44px',
                  borderRadius: '999px',
                  border: '1px solid var(--border-mid, rgba(200, 169, 131, 0.3))',
                  background: 'var(--card-bg, #ffffff)',
                  color: 'var(--ink)',
                  fontSize: '14px',
                  outline: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                }}
              />
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '14px' }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Navigation Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
              {[
                { id: 'all', label: 'All Guides' },
                { id: 'regions', label: 'Regional Deep Dives' },
                { id: 'tips', label: 'Local Tips & Etiquette' },
                { id: 'phrasebook', label: 'Georgian Phrasebook' },
                { id: 'companions', label: 'Vetted Guides' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '999px',
                    border: '1px solid',
                    borderColor: activeTab === tab.id ? 'var(--accent, #d9653b)' : 'var(--border, rgba(26,18,14,0.1))',
                    background: activeTab === tab.id ? 'var(--accent, #d9653b)' : 'transparent',
                    color: activeTab === tab.id ? '#ffffff' : 'var(--ink)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </header>

          {/* Main Content Area */}
          <main style={{ flexGrow: 1, padding: '0 24px 80px', maxWidth: '1100px', width: '100%', margin: '0 auto' }}>

            {/* SECTION 1: REGIONAL DEEP DIVES */}
            {(activeTab === 'all' || activeTab === 'regions') && (
              <section style={{ marginBottom: '64px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', fontWeight: 700, margin: '0 0 6px', color: 'var(--ink)' }}>
                      Regional Travel Dossiers
                    </h2>
                    <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
                      Handcrafted intelligence across Georgia’s 12 historic provinces.
                    </p>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                    {filteredRegions.length} Destinations
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
                  {filteredRegions.map(reg => (
                    <article
                      key={reg.id}
                      className="hover-lift"
                      style={{
                        background: 'var(--card-bg, #ffffff)',
                        borderRadius: '20px',
                        border: '1px solid var(--border-mid, rgba(200, 169, 131, 0.25))',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 8px 24px -6px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={reg.img}
                          alt={reg.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(11,19,43,0.78)', backdropFilter: 'blur(8px)', color: '#c8a983', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700 }}>
                          {reg.listingsCount}+ Stays
                        </div>
                      </div>

                      <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent, #d9653b)', fontWeight: 800, marginBottom: '6px' }}>
                          Best: {reg.bestSeason}
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 6px', color: 'var(--ink)' }}>
                          {reg.name}
                        </h3>
                        <div style={{ fontSize: '12.5px', fontStyle: 'italic', color: 'var(--muted)', marginBottom: '12px' }}>
                          {reg.tagline}
                        </div>
                        <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--ink-soft, #4b5563)', margin: '0 0 16px', flex: 1 }}>
                          {reg.desc}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                          {reg.highlights.map(h => (
                            <span key={h} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(217,101,59,0.08)', color: 'var(--ink)', fontWeight: 600 }}>
                              • {h}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={reg.link}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 16px',
                            borderRadius: '12px',
                            background: 'var(--surface-warm, #f8e2cb)',
                            color: 'var(--ink, #241712)',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: 700,
                            transition: 'opacity 0.2s ease',
                          }}
                        >
                          <span>Explore {reg.name.split(' ')[0]}</span>
                          <span>&rarr;</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 2: LOCAL INSIDER TIPS & ETIQUETTE */}
            {(activeTab === 'all' || activeTab === 'tips') && (
              <section style={{ marginBottom: '64px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', fontWeight: 700, margin: '0 0 6px', color: 'var(--ink)' }}>
                    Essential Local Tips &amp; Cultural Etiquette
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
                    Practical knowledge you need before landing at Tbilisi or Kutaisi.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
                  {filteredTips.map(tip => (
                    <div
                      key={tip.id}
                      style={{
                        background: 'var(--card-bg, #ffffff)',
                        borderRadius: '18px',
                        border: '1px solid var(--border-mid, rgba(200, 169, 131, 0.25))',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(217,101,59,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                          {tip.icon}
                        </div>
                        <div>
                          <span style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)', fontWeight: 800 }}>
                            {tip.category}
                          </span>
                          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '2px 0 0', color: 'var(--ink)' }}>
                            {tip.title}
                          </h3>
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--ink-soft, #4b5563)', margin: 0 }}>
                        {tip.details}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 3: GEORGIAN PHRASEBOOK */}
            {(activeTab === 'all' || activeTab === 'phrasebook') && (
              <section style={{ marginBottom: '64px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', fontWeight: 700, margin: '0 0 6px', color: 'var(--ink)' }}>
                      Georgian Phrasebook Essentials
                    </h2>
                    <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
                      Saying even a single word in Georgian brings an instant warm smile from locals.
                    </p>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Click any card to copy
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
                  {filteredPhrases.map((p, idx) => (
                    <button
                      key={p.ka}
                      onClick={() => copyPhrase(`${p.ka} (${p.en})`, idx)}
                      style={{
                        background: 'var(--card-bg, #ffffff)',
                        borderRadius: '16px',
                        border: '1px solid var(--border-mid, rgba(200, 169, 131, 0.2))',
                        padding: '18px 16px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', fontWeight: 800 }}>
                          {p.category}
                        </span>
                        <span style={{ fontSize: '11px', color: copiedIndex === idx ? '#16a34a' : 'var(--muted)', fontWeight: 700 }}>
                          {copiedIndex === idx ? '✓ Copied!' : 'Copy'}
                        </span>
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent, #d9653b)', letterSpacing: '0.02em' }}>
                        {p.ka}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>
                        {p.en}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontStyle: 'italic' }}>
                        &ldquo;{p.pronounce}&rdquo;
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-soft, #64748b)', marginTop: '2px' }}>
                        {p.meaning}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 4: VETTED LOCAL COMPANIONS & GUIDES */}
            {(activeTab === 'all' || activeTab === 'companions') && (
              <section style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', fontWeight: 700, margin: '0 0 6px', color: 'var(--ink)' }}>
                      Vetted Caucasian Companions &amp; Guides
                    </h2>
                    <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
                      Official certified mountain guides, sommeliers, and translators for your journey.
                    </p>
                  </div>
                  <Link
                    href="/connect"
                    style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}
                  >
                    View all companions &rarr;
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
                  {VETTED_GUIDES.map(guide => (
                    <div
                      key={guide.id}
                      style={{
                        background: 'var(--card-bg, #ffffff)',
                        borderRadius: '20px',
                        border: '1px solid var(--border-mid, rgba(200, 169, 131, 0.25))',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <img
                          src={guide.avatar}
                          alt={guide.name}
                          style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #c8a983' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>{guide.name}</h3>
                            <span title="Verified Host" style={{ color: '#10b981', fontSize: '14px' }}>✓</span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--accent, #d9653b)', fontWeight: 600 }}>{guide.role}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Region: {guide.region}</div>
                        </div>
                      </div>

                      <div style={{ fontSize: '12.5px', color: 'var(--ink-soft, #4b5563)', background: 'rgba(0,0,0,0.02)', padding: '10px 14px', borderRadius: '10px' }}>
                        <strong>Specialty:</strong> {guide.specialty}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border, rgba(0,0,0,0.06))' }}>
                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                          ★ <strong style={{ color: 'var(--ink)' }}>{guide.rating}</strong> ({guide.tripsCount} trips)
                        </div>
                        <Link
                          href={`/connect`}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '999px',
                            background: 'var(--accent, #d9653b)',
                            color: '#ffffff',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: 700,
                          }}
                        >
                          Connect with {guide.name.split(' ')[0]}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bottom Call to Action */}
            <div
              style={{
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #0B132B 0%, #1c2a4a 100%)',
                color: '#ffffff',
                padding: '48px 32px',
                textAlign: 'center',
                boxShadow: '0 20px 40px -15px rgba(11,19,43,0.4)',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', fontWeight: 700, margin: '0 0 12px', color: '#ffffff' }}>
                Need a Custom Caucasian Itinerary?
              </h2>
              <p style={{ maxWidth: '560px', margin: '0 auto 24px', fontSize: '15px', color: '#cbd5e1', lineHeight: 1.6 }}>
                Let local hosts design an authentic route tailored to your exact budget, group size, and favorite Georgian regions.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <Link
                  href="/trip-planner"
                  style={{
                    padding: '12px 28px',
                    borderRadius: '999px',
                    backgroundColor: '#c8a983',
                    color: '#0B132B',
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: '14px',
                  }}
                >
                  Plan Route Now &rarr;
                </Link>
                <Link
                  href="/connect"
                  style={{
                    padding: '12px 28px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  Find a Local Guide
                </Link>
              </div>
            </div>

          </main>
        </div>
      </div>

      {/* Full Width Footer */}
      <footer className="site-footer" style={{ marginTop: 'auto' }}>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="brandmark-dot"></span>
              <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
            </div>
            <p className="footer-tagline">Discover Georgia through curated offers, services, structured platform flows and thoughtful local context.</p>
          </div>
          <div className="footer-links">
            <h4>Product</h4>
            <Link href="/offers">Offers</Link>
            <Link href="/restaurants">Restaurants</Link>
            <Link href="/tours">Tours</Link>
            <Link href="/guides">Guides</Link>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div className="footer-links">
            <h4>Platform</h4>
            <Link href="/dashboard">Tourist dashboard</Link>
            <Link href="/business/dashboard">Business dashboard</Link>
            <Link href="/admin">Admin panel</Link>
          </div>
        </div>
        <div className="copyright">
          <span>© 2026 Kaya.ge — Discover Georgia</span>
          <span>Sakartvelo Travel Intelligence</span>
        </div>
      </footer>
    </div>
  );
}
