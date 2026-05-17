'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function KlaraWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'klara' | 'user', content: string}[]>([
    { role: 'klara', content: 'Gamarjoba! I\'m KLARA, your Georgian AI guide. How can I help you plan your journey?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hide widget on admin dashboard, login, and full klara page
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login') || pathname === '/klara' || pathname === '/chat') {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // Small simulated delay for realistic feel
      await new Promise(r => setTimeout(r, 600));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, context: 'widget' })
      });

      if (!res.ok) throw new Error('Failed to fetch reply');
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'klara', content: data.reply || data.response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'klara', content: 'I apologize, my connection to the Georgian network is currently interrupted. Please try again soon.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
          pointerEvents: 'none'
        }}
      >
        {/* Chat window */}
        <div 
          style={{
            width: '340px', height: '480px', maxHeight: 'calc(100vh - 100px)',
            background: 'rgba(255, 251, 246, 0.95)',
            backdropFilter: 'blur(24px) saturate(120%)',
            border: '1px solid hsla(0,0%,100%,.35)',
            borderRadius: '24px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            marginBottom: '16px',
            pointerEvents: 'auto',
            transformOrigin: 'bottom right',
            animation: 'klara-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px', background: 'rgba(26,18,14,0.95)', color: '#fff',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #b87a55, #8a5a3e)',
                display: 'grid', placeItems: 'center', fontSize: '14px', fontWeight: 800
              }}>K</div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px', letterSpacing: '0.02em' }}>KLARA AI</strong>
                <span style={{ fontSize: '11px', opacity: 0.7 }}>Your Personal Local</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '12px 16px', fontSize: '13px', lineHeight: 1.5,
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user' ? '#1a120e' : 'rgba(236,198,166,0.3)',
                  color: m.role === 'user' ? '#fff' : '#1a120e'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'rgba(236,198,166,0.3)', fontSize: '13px' }}>
                  <span style={{ opacity: 0.5 }}>Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', position: 'relative' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask KLARA anything..."
                style={{
                  flex: 1, padding: '12px 40px 12px 16px', borderRadius: '999px',
                  border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.8)',
                  fontSize: '13px', outline: 'none'
                }}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                style={{
                  position: 'absolute', right: '4px', top: '4px', bottom: '4px', width: '36px',
                  borderRadius: '50%', background: input.trim() ? '#1a120e' : 'transparent',
                  color: input.trim() ? '#fff' : 'rgba(0,0,0,0.3)', border: 'none',
                  display: 'grid', placeItems: 'center', cursor: input.trim() ? 'pointer' : 'default',
                  transition: 'all 0.2s'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a120e, #2a1f18)',
            color: '#fff', border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(26,18,14,0.4)',
            display: 'grid', placeItems: 'center',
            pointerEvents: 'auto',
            transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          )}
        </button>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes klara-pop {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />
    </>
  );
}
