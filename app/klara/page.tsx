'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function KlaraBot() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([
    { text: "Hello! I'm KLARA, your AI travel assistant for Georgia. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = { text: inputValue, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    try {
      const response = await fetchKlaraAPI(inputValue);
      setMessages(prev => [...prev, { text: response, sender: 'bot' as const }]);
    } catch {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now. Please try again later.", sender: 'bot' as const }]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchKlaraAPI = async (msg: string): Promise<string> => {
    try {
      const res = await fetch('/api/klara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      return data.content || 'Sorry, I could not process that.';
    } catch {
      return 'Sorry, I\'m having trouble connecting. Please try again later.';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8f1ea 0%, #efe3d6 50%, #fdf7f0 100%)' }}>
      {/* Inline Glass Nav */}
      <div className="sticky-nav-shell visible" style={{ top: '54px', transform: 'translateX(-50%)' }}>
        <nav className="nav nav-sticky-bar" style={{ transform: 'scale(1.08)' }}>
          <Link href="/" className="nav-brand">
            <span className="brandmark-dot"></span>
            <span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span>
          </Link>
            <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu">
              <span></span><span></span><span></span>
            </button>
          <div className="nav-links">
            <Link href="/klara">KLARA</Link>
            <Link href="/search">Visitors</Link>
            <Link href="/hotels">Stays</Link>
            <Link href="/muse">Where to go</Link>
            <Link href="/contact">Contact us</Link>
          </div>
          <div className="nav-spacer"></div>
          <div className="nav-right">
            <Link href="/login">Become a host</Link>
            <Link href="/login" className="nav-icon" aria-label="Login">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"></path></svg>
            </Link>
          </div>
        </nav>
      </div>

        {/* Mobile Nav Overlay */}
        <div className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}>
          <button className="mobile-nav-overlay-close" onClick={() => setMobileNavOpen(false)}>✕</button>
          <Link href="/klara" onClick={() => setMobileNavOpen(false)}>KLARA</Link>
          <Link href="/search" onClick={() => setMobileNavOpen(false)}>Visitors</Link>
          <Link href="/hotels" onClick={() => setMobileNavOpen(false)}>Stays</Link>
          <Link href="/muse" onClick={() => setMobileNavOpen(false)}>Where to go</Link>
          <Link href="/contact" onClick={() => setMobileNavOpen(false)}>Contact us</Link>
          <Link href="/login" onClick={() => setMobileNavOpen(false)}>Become a host</Link>
        </div>

      {/* Spacer for fixed nav */}
      <div className="nav-spacer-block" style={{ height: '128px' }}></div>

      {/* Main Content */}
      <div className="shell" style={{ padding: '0 0 64px' }}>
        {/* Chat Card */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'rgba(255, 251, 246, 0.78)',
          backdropFilter: 'blur(12px) saturate(110%)',
          WebkitBackdropFilter: 'blur(12px) saturate(110%)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          borderRadius: '20px',
          boxShadow: '0 18px 36px -12px rgba(70, 40, 25, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '640px',
          maxHeight: 'calc(100vh - 180px)'
        }}>
          {/* Chat Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '18px 24px',
            borderBottom: '1px solid rgba(26, 18, 14, 0.08)',
            background: 'rgba(255, 251, 246, 0.5)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1a120e, #4a3228)',
              display: 'grid',
              placeItems: 'center',
              color: '#fff8ef',
              fontWeight: 700,
              fontSize: '16px',
              fontFamily: 'Cormorant Garamond, serif'
            }}>K</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#1a120e' }}>KLARA</div>
              <div style={{ fontSize: '12px', color: 'rgba(26, 18, 14, 0.55)' }}>AI Travel Assistant</div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            scrollBehavior: 'smooth'
          }}>
            {messages.map((message, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                animation: 'fadeUp 0.3s ease'
              }}>
                {message.sender === 'bot' && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #1a120e, #4a3228)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff8ef',
                    fontWeight: 700,
                    fontSize: '12px',
                    fontFamily: 'Cormorant Garamond, serif',
                    flexShrink: 0,
                    marginRight: '10px'
                  }}>K</div>
                )}
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 18px',
                  borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: message.sender === 'user' ? '#1a120e' : 'rgba(236, 198, 166, 0.25)',
                  color: message.sender === 'user' ? '#fff8ef' : '#1a120e',
                  fontSize: '14px',
                  lineHeight: 1.55,
                  wordBreak: 'break-word',
                  boxShadow: message.sender === 'user' ? '0 4px 12px rgba(26, 18, 14, 0.15)' : 'none'
                }}>
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1a120e, #4a3228)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff8ef',
                  fontWeight: 700,
                  fontSize: '12px',
                  fontFamily: 'Cormorant Garamond, serif',
                  flexShrink: 0,
                  marginRight: '10px'
                }}>K</div>
                <div style={{
                  padding: '14px 20px',
                  borderRadius: '18px 18px 18px 4px',
                  background: 'rgba(236, 198, 166, 0.25)',
                  display: 'flex',
                  gap: '5px',
                  alignItems: 'center'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(26, 18, 14, 0.4)', animation: 'pulse-glow 1.4s infinite', display: 'inline-block' }}></span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(26, 18, 14, 0.4)', animation: 'pulse-glow 1.4s infinite', animationDelay: '0.2s', display: 'inline-block' }}></span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(26, 18, 14, 0.4)', animation: 'pulse-glow 1.4s infinite', animationDelay: '0.4s', display: 'inline-block' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div style={{
            padding: '18px 24px',
            borderTop: '1px solid rgba(26, 18, 14, 0.08)',
            background: 'rgba(255, 251, 246, 0.5)'
          }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask KLARA about properties, bookings, or travel in Georgia..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    border: '1px solid rgba(26, 18, 14, 0.1)',
                    borderRadius: '999px',
                    fontSize: '14px',
                    background: 'rgba(255, 255, 255, 0.6)',
                    color: '#1a120e',
                    outline: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(26, 18, 14, 0.25)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(26, 18, 14, 0.06)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(26, 18, 14, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  style={{
                    width: '44px',
                    height: '44px',
                    border: '0',
                    borderRadius: '999px',
                    background: !inputValue.trim() || isLoading ? 'rgba(26, 18, 14, 0.15)' : '#1a120e',
                    color: '#fff8ef',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: !inputValue.trim() || isLoading ? 'not-allowed' : 'pointer',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    if (inputValue.trim() && !isLoading) {
                      e.currentTarget.style.transform = 'scale(1.08)';
                      e.currentTarget.style.boxShadow = '0 8px 20px -6px rgba(0,0,0,0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {isLoading ? (
                    <div style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: 'transparent',
                      borderRightColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* What KLARA can help with */}
        <div style={{ maxWidth: '800px', margin: '48px auto 0' }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '28px',
            fontWeight: 600,
            textAlign: 'center',
            margin: '0 0 24px',
            color: '#1a120e'
          }}>What KLARA can help with</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
          }}>
            {[
              { title: 'Property & Stay Info', desc: 'Details on hotels, apartments, and unique stays across Georgia' },
              { title: 'Travel Planning', desc: 'Itineraries, routes, and tips for exploring Georgia' },
              { title: 'Local Recommendations', desc: 'Hidden gems, authentic food, and cultural experiences' },
              { title: 'Booking Assistance', desc: 'Help with reservations, pricing, and modifications' }
            ].map((feature, i) => (
              <div key={i} style={{
                background: 'rgba(255, 251, 246, 0.78)',
                backdropFilter: 'blur(12px) saturate(110%)',
                WebkitBackdropFilter: 'blur(12px) saturate(110%)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '20px',
                boxShadow: '0 18px 36px -12px rgba(70, 40, 25, 0.15)',
                padding: '24px 20px',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 24px 48px -16px rgba(70, 40, 25, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 18px 36px -12px rgba(70, 40, 25, 0.15)';
                }}
              >
                <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700, color: '#1a120e' }}>{feature.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.55, color: 'rgba(26, 18, 14, 0.6)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
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
        <div className="footer-bottom shell">
          <span>&copy; {new Date().getFullYear()} Kaya.ge &mdash; crafted in Tbilisi</span>
        </div>
      </footer>
    </div>
  );
}
