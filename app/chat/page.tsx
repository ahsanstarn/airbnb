'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './chat.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestions = [
  '🏨 Best hotels in Tbilisi under ₾200',
  '🍷 Plan a wine tour in Kakheti',
  '🏔️ 3-day itinerary for Kazbegi',
  '🍽️ Top restaurants in Batumi',
  '🎭 What to do in Tbilisi this weekend',
  '💆 Best spas and hammams',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm KLARA, your AI travel companion for Georgia 🇬🇪\n\nI can help you find hotels, plan itineraries, recommend restaurants, and answer any questions about traveling in Georgia.\n\nWhat would you like to explore?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    // In production, this calls /api/chat which uses Claude API server-side
    // For demo, we simulate a response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'hotel': "Here are some top-rated hotels in Tbilisi:\n\n🏨 **Rooms Hotel Tbilisi** — ₾280/night (Vera district)\n🏨 **Stamba Hotel** — ₾350/night (Design district)\n🏨 **Shota @ Rustaveli** — ₾195/night (Rustaveli Ave)\n\nWould you like me to check availability for specific dates?",
        'wine': "Kakheti is Georgia's premier wine region! Here's a suggested wine tour:\n\n🍇 **Day 1:** Visit Château Mukhrani, then drive to Sighnaghi\n🍇 **Day 2:** Explore Tsinandali Estate, visit local qvevri cellars\n🍇 **Day 3:** Telavi town, Alaverdi Monastery\n\nI can find you stays in Sighnaghi starting from ₾80/night. Interested?",
        'kazbegi': "Here's a perfect 3-day Kazbegi itinerary:\n\n🏔️ **Day 1:** Drive Georgian Military Highway, stop at Ananuri Fortress. Arrive Stepantsminda.\n🏔️ **Day 2:** Hike to Gergeti Trinity Church (3hrs round trip). Afternoon at hotel.\n🏔️ **Day 3:** Juta Valley hike or horse riding. Return to Tbilisi.\n\n**Best stays:** Mountain Lodge (₾120/night) has incredible Kazbek views!",
        'restaurant': "Top restaurants in Batumi:\n\n🍽️ **Khinkalnia** — Best khinkali in town, ₾15-25 per person\n🍽️ **Porto Franco** — Seafood with sea views, ₾40-60\n🍽️ **Café Literaturuli** — Cozy café, great for brunch, ₾20-30\n\nWant me to check if any accept reservations through Kaya?",
        'default': "That's a great question! Georgia has so much to offer. 🇬🇪\n\nHere are some things I can help with:\n• 🏨 Finding and booking accommodation\n• 🗺️ Planning day-by-day itineraries\n• 🍷 Wine tours and culinary experiences\n• 🏔️ Hiking and adventure activities\n• 🚗 Car rentals and transport\n\nWhat interests you most?"
      };

      const key = Object.keys(responses).find(k => userMsg.toLowerCase().includes(k)) || 'default';
      setMessages(prev => [...prev, { role: 'assistant', content: responses[key] }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="#E8573A" opacity="0.15"/>
            <path d="M16 6l3.09 6.26L26 13.27l-5 4.87 1.18 6.88L16 21.77l-6.18 3.25L11 18.14l-5-4.87 6.91-1.01L16 6z" fill="#E8573A"/>
          </svg>
          <span>KLARA</span>
        </Link>
        <p className={styles.sidebarDesc}>Your AI travel assistant for Georgia</p>
        <div className={styles.sidebarSuggestions}>
          <p className={styles.sidebarLabel}>Try asking</p>
          {suggestions.map((s, i) => (
            <button key={i} className={styles.suggestion} onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>
        <Link href="/" className={styles.backLink}>← Back to Kaya</Link>
      </aside>

      {/* Chat Area */}
      <main className={styles.chatArea}>
        <div className={styles.messages}>
          {messages.map((msg, i) => (
            <div key={i} className={`${styles.msg} ${msg.role === 'user' ? styles.msgUser : styles.msgBot}`}>
              {msg.role === 'assistant' && <div className={styles.msgAvatar}>🤖</div>}
              <div className={styles.msgContent}>
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>{line}<br/></span>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.msg} ${styles.msgBot}`}>
              <div className={styles.msgAvatar}>🤖</div>
              <div className={styles.msgContent}>
                <span className={styles.typing}>Thinking<span className={styles.dots}>...</span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <div className={styles.inputWrap}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask KLARA about Georgia..."
              className={styles.input}
            />
            <button
              className={styles.sendBtn}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
          <p className={styles.disclaimer}>KLARA can make mistakes. Verify important information.</p>
        </div>
      </main>
    </div>
  );
}
