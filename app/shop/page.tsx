'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LANGUAGES = [
  { code: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'KA', label: 'ქართული', flag: '🇬🇪' },
  { code: 'RU', label: 'Русский', flag: '🇷🇺' },
];

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    if (search) params.set('q', search);
    fetch(`/api/shop/products?${params.toString()}`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setCategories(d.categories || []); })
      .catch(() => {});
  }, [activeCategory, search]);

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const nav = (
    <>
      <div className="sticky-nav-shell visible" style={{ top: '54px', transform: 'translateX(-50%)' }}>
        <nav className="nav nav-sticky-bar" style={{ transform: 'scale(1.08)' }}>
          <Link href="/" className="nav-brand"><span className="brandmark-dot"></span><span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span></Link>
          <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu"><span></span><span></span><span></span></button>
          <div className="nav-links"><Link href="/klara">KLARA</Link><Link href="/search">Visitors</Link><Link href="/hotels">Stays</Link><Link href="/muse">Where to go</Link><Link href="/contact">Contact us</Link></div>
          <div className="nav-spacer"></div>
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setLangOpen(!langOpen)} style={{ background: 'rgba(255,251,246,.7)', border: '0', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{currentLang}</button>
              {langOpen && <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', background: '#fff8ef', borderRadius: '12px', boxShadow: '0 12px 40px rgba(0,0,0,.12)', overflow: 'hidden', zIndex: 50, minWidth: '120px' }}>{LANGUAGES.map(l => <button key={l.code} onClick={() => { setCurrentLang(l.code); setLangOpen(false); }} style={{ display: 'block', width: '100%', padding: '8px 14px', border: '0', background: currentLang === l.code ? 'rgba(0,0,0,.05)' : 'transparent', cursor: 'pointer', fontSize: '13px', textAlign: 'left', color: 'var(--text)' }}>{l.flag} {l.label}</button>)}</div>}
            </div>
            <Link href="/login">Become a host</Link>
          </div>
        </nav>
      </div>
      <div className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}>
        <button className="mobile-nav-overlay-close" onClick={() => setMobileNavOpen(false)}>✕</button>
        <Link href="/klara" onClick={() => setMobileNavOpen(false)}>KLARA</Link>
        <Link href="/search" onClick={() => setMobileNavOpen(false)}>Visitors</Link>
        <Link href="/hotels" onClick={() => setMobileNavOpen(false)}>Stays</Link>
        <Link href="/muse" onClick={() => setMobileNavOpen(false)}>Where to go</Link>
        <Link href="/contact" onClick={() => setMobileNavOpen(false)}>Contact us</Link>
        <div style={{ marginTop: '20px', padding: '0 24px' }}>{LANGUAGES.map(l => <button key={l.code} onClick={() => { setCurrentLang(l.code); setMobileNavOpen(false); }} style={{ display: 'block', width: '100%', padding: '8px 0', border: '0', background: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: currentLang === l.code ? 700 : 400, textAlign: 'left', color: '#fff8ef' }}>{l.flag} {l.label}</button>)}</div>
      </div>
    </>
  );

  const glass = { borderRadius: '20px', background: 'rgba(255,251,246,.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f8f1ea 0%, #efe3d6 35%, #f5ece3 70%, #fdf7f0 100%)' }}>
      {nav}

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1553545204-4f7d8f68b0f4?w=1600&h=900&fit=crop) 50%/cover', opacity: 0.08 }} />
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <span style={{ fontSize: '44px', display: 'block', marginBottom: '12px' }}>🛍️</span>
          <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, margin: '0 0 8px' }}>Kaya Supply</h1>
          <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>Curated Georgian products — wines, crafts, spices, and souvenirs. Authentic finds delivered to your door.</p>
        </div>
      </section>

      {/* Search + cart */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 24px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ flex: '1', minWidth: '220px', maxWidth: '400px', padding: '10px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,.08)', fontSize: '14px', background: 'rgba(255,251,246,.7)', outline: 'none' }} />
        {totalItems > 0 && <div style={{ ...glass, padding: '8px 16px', fontSize: '13px', fontWeight: 600 }}>🛒 {totalItems} {totalItems === 1 ? 'item' : 'items'}</div>}
      </div>

      {/* Categories */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 32px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveCategory('')} style={{
          padding: '8px 20px', borderRadius: '999px', border: '0', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
          background: !activeCategory ? '#1a120e' : 'rgba(255,251,246,.7)', color: !activeCategory ? '#fff8ef' : 'var(--muted)',
          transition: 'all .25s',
        }}>All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(activeCategory === c ? '' : c)} style={{
            padding: '8px 20px', borderRadius: '999px', border: '0', cursor: 'pointer', fontSize: '13px', fontWeight: 700, textTransform: 'capitalize',
            background: activeCategory === c ? '#1a120e' : 'rgba(255,251,246,.7)', color: activeCategory === c ? '#fff8ef' : 'var(--muted)',
            transition: 'all .25s',
          }}>{c}</button>
        ))}
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 60px' }}>
        {selectedProduct ? (
          <div style={{ ...glass, padding: '36px', maxWidth: '700px', margin: '0 auto' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--muted)', marginBottom: '20px', display: 'block' }}>← All products</button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
              <div style={{ width: '100%', height: '300px', borderRadius: '16px', background: `url(${selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1553545204-4f7d8f68b0f4?w=600&fit=crop'}) 50%/cover` }} />
              <div>
                <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px' }}>{selectedProduct.name}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '12px' }}>{selectedProduct.description}</p>
                <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>{selectedProduct.price} GEL</div>
                {selectedProduct.stock > 0 ? <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>In stock ({selectedProduct.stock} available)</span> : <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>Out of stock</span>}
                <button onClick={() => addToCart(selectedProduct.id)} style={{ display: 'block', marginTop: '16px', width: '100%', padding: '12px', borderRadius: '12px', border: '0', background: '#1a120e', color: '#fff8ef', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Add to Cart</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {products.map(p => (
              <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ ...glass, padding: '16px', cursor: 'pointer', transition: 'transform .2s' }}>
                <div style={{ width: '100%', height: '180px', borderRadius: '12px', background: `url(${p.images?.[0] || 'https://images.unsplash.com/photo-1553545204-4f7d8f68b0f4?w=600&fit=crop'}) 50%/cover`, marginBottom: '12px' }} />
                <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', marginBottom: '4px' }}>{p.category}</div>
                <h3 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1rem', fontWeight: 700, margin: '0 0 4px' }}>{p.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '16px' }}>{p.price} GEL</span>
                  {p.stock > 0 ? <span style={{ fontSize: '11px', color: '#22c55e' }}>In stock</span> : <span style={{ fontSize: '11px', color: '#ef4444' }}>Sold out</span>}
                </div>
                <button onClick={e => { e.stopPropagation(); addToCart(p.id); }} style={{ width: '100%', marginTop: '10px', padding: '8px', borderRadius: '10px', border: '1px solid rgba(0,0,0,.08)', background: 'transparent', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Add to Cart</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
