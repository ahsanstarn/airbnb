'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/lang-context';

const HERO_SLIDES = [
  {
    id: 'tbilisi',
    kicker: 'City Stay',
    eyebrow: 'Featured Stay',
    title: 'STAY IN',
    titleSpan: 'TBILISI',
    copyTitle: 'Discover Tbilisi',
    copyText: 'Ancient history, winding brick streets, cozy sulphur baths, and a vibrant modern culinary scene at the heart of Georgia.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80',
    price: '180 GEL / night',
    location: 'Tbilisi, Old Town',
    rating: '4.9 rating',
    desc: 'kaya.ge helps you find Tbilisi stays fast, clearly and without extra steps.'
  },
  {
    id: 'kazbegi',
    kicker: 'Mountain Escape',
    eyebrow: 'Featured Stay',
    title: 'BREATHE IN',
    titleSpan: 'KAZBEGI',
    copyTitle: 'Discover Kazbegi',
    copyText: 'Snowline views, dramatic ridges, ancient church silhouettes and crisp alpine air make this the ultimate contrast to the capital.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
    price: '280 GEL / night',
    location: 'Kazbegi, Gergeti',
    rating: '4.8 rating',
    desc: 'kaya.ge helps you find Kazbegi stays fast, clearly and without extra steps.'
  },
  {
    id: 'batumi',
    kicker: 'Sea View Stay',
    eyebrow: 'Featured Stay',
    title: 'WAVES OF',
    titleSpan: 'BATUMI',
    copyTitle: 'Discover Batumi',
    copyText: 'A light-filled stay framed around the promenade, sea-facing mornings, magnetic sunsets, and easy evening walks along the coast.',
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80',
    price: '210 GEL / night',
    location: 'Batumi, Coastline',
    rating: '4.7 rating',
    desc: 'kaya.ge helps you find Batumi stays fast, clearly and without extra steps.'
  }
];

export default function Home() {
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(1);
  const heroRef = useRef<HTMLDivElement>(null);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealRefs.current.forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const slide = HERO_SLIDES[activeSlide];
  const tTitle = t(slide.id + '_title');
  const tSpan = t(slide.id + '_span');
  const tCopyTitle = t(slide.id + '_copyTitle');
  const tCopyText = t(slide.id + '_copyText');

  const slideData = (idx: number) => {
    const s = HERO_SLIDES[idx];
    return { title: t(s.id + '_title'), span: t(s.id + '_span'), copyTitle: t(s.id + '_copyTitle'), copyText: t(s.id + '_copyText'), image: s.image };
  };

  const setRevealRef = (i: number) => (el: HTMLElement | null) => { revealRefs.current[i] = el; };

  return (
    <div className="site-shell">
      <div className="shell">
        <div className="homepage-shell">

          {/* Hero Stage */}
          <div className="hero-stage depth-scene">
            <div className="hero mouse-tilt-hero" ref={heroRef}>
              <div className="hero-media active" style={{ backgroundImage: `url(${slide.image})` }}></div>
              <div className="hero-mist depth-mid"></div>
              <div className="hero-content depth-fg">
                <div className="hero-title-area">
                  <h1 className="hero-title animate-blur-in" style={{ perspective: '800px' }}>
                    {tTitle}<span className="animate-slide-up animate-delay-2">{tSpan}</span>
                  </h1>
                  <div className="hero-copy animate-slide-up animate-delay-3">
                    <h2>{tCopyTitle}</h2>
                    <p>{tCopyText}</p>
                  </div>
                </div>
                
                {/* Right side circular thumbnails */}
                <div className="hero-thumbnails float-3d-slow">
                  {HERO_SLIDES.map((s, i) => (
                    <div 
                      key={s.id} 
                      className={`hero-thumb tilt-3d-light ${i === activeSlide ? 'active' : ''}`} 
                      style={{ backgroundImage: `url(${s.image})` }} 
                      onClick={() => setActiveSlide(i)} 
                      aria-label={s.copyTitle}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Hero Carousel */}
          <div className="mobile-hero-banner-carousel">
            <div className="mobile-hero-banner-carousel-track">
              {HERO_SLIDES.map((s, i) => {
                const sd = slideData(i);
                return (
                  <div key={s.id} className="hero-side-card hero-side-card-listing card-3d-glow" style={{ minWidth: '280px', scrollSnapAlign: 'start' }} onClick={() => setActiveSlide(i)}>
                    <div className="hero-side-card-listing-overlay depth-bg" style={{ backgroundImage: `url(${sd.image})` }}></div>
                    <div className="hero-side-card-listing-rail depth-fg">
                      <div className="hero-side-card-listing-top">
                        <span className="hero-side-card-kicker">{s.kicker}</span>
                        <span className="hero-side-price">{s.price}</span>
                      </div>
                      <div className="hero-side-card-listing-bottom">
                        <h3>{sd.copyTitle}</h3>
                        <p>{sd.copyText.slice(0, 60)}...</p>
                      </div>
                      <div className="hero-side-listing-footer">
                        <span>{s.rating}</span>
                        <span>{t('seeListing')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mobile-hero-banner-carousel-dot">
              {HERO_SLIDES.map((_, i) => (
                <button key={i} className={i === activeSlide ? 'active' : ''} onClick={() => setActiveSlide(i)} />
              ))}
            </div>
          </div>

          {/* Featured Offers Section */}
          <section className="homepage-featured-section fade-up" ref={setRevealRef(0)}>
            <div className="section-head">
              <div>
                <h2 className="section-title">{t('popularOffers')}</h2>
                <p className="section-copy">{t('offersDesc')}</p>
              </div>
            </div>
            <div className="homepage-empty-card card-3d">
              <strong>{t('noOffersYet')}</strong>
              <p>{t('noOffersDesc')}</p>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer fade-up" ref={setRevealRef(1)}>
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="brandmark">
                  <span className="brandmark-dot"></span>
                  <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
                </div>
                <p className="footer-tagline">{t('footerDesc')}</p>
              </div>
              <div>
                <h4>{t('offers')}</h4>
                <ul>
                  <li><Link href="/offers">{t('offers')}</Link></li>
                  <li><Link href="/restaurants">{t('restaurants')}</Link></li>
                  <li><Link href="/tours">{t('tours')}</Link></li>
                  <li><Link href="/muse">{t('muse')}</Link></li>
                </ul>
              </div>
              <div>
                <h4>{t('company')}</h4>
                <ul>
                  <li><Link href="/about">{t('about')}</Link></li>
                  <li><Link href="/contact">{t('contact')}</Link></li>
                  <li><Link href="/blog">{t('blog')}</Link></li>
                </ul>
              </div>
              <div>
                <h4>{t('platform')}</h4>
                <ul>
                  <li><Link href="/dashboard">{t('touristDashboard')}</Link></li>
                  <li><Link href="/business/dashboard">{t('businessDashboard')}</Link></li>
                  <li><Link href="/admin">{t('adminPanel')}</Link></li>
                </ul>
              </div>
            </div>
            <div className="copyright">
              <span>© 2026 Kaya.ge — Discover Georgia</span>
              <span>Built around the Phase 1 brief</span>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
