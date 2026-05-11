'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import styles from './klara.module.css';

export default function KlaraBot() {
  const router = useRouter();
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([
    { text: "Hello! I'm Klara, your AI assistant for Kaya.ge. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual Klara API when provided
      const response = await fetchKlaraAPI(inputValue);
      const botMessage = { text: response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { text: "Sorry, I'm having trouble connecting right now. Please try again later.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchKlaraAPI = async (message: string): Promise<string> => {
    // Placeholder API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          "I can help you find the perfect accommodation in Georgia! What type of property are you looking for?",
          "Kaya.ge offers hotels, apartments, villas, and unique experiences across Georgia. Would you like to see our recommendations?",
          "I can provide information about pricing, availability, and booking procedures. What would you like to know?",
          "For the best experience, I recommend checking out our featured properties in Tbilisi, Batumi, and Kakheti.",
          "Would you like me to help you search for properties based on your preferences?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        resolve(randomResponse);
      }, 1000 + Math.random() * 2000);
    });
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>Klara - Your AI Assistant</h1>
        
        <div className={styles.chatContainer}>
          <div className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.botMessage}`}
              >
                <div className={styles.messageBubble}>
                  {message.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.messageBubble}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.inputContainer}>
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Klara anything about properties, bookings, or travel in Georgia..."
                  className={styles.messageInput}
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !inputValue.trim()}
                  className={styles.sendButton}
                >
                  {isLoading ? (
                    <div className={styles.loadingSpinner}></div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L21 4c0-1.1-.9-2-2-2s.9 2 2 2 2 .9 2 2 2zm.01 0L4 19c-1.1 0-2 .9-2 2-2s-.9 2-2 2-2zm12.01 0L4 19c-1.1 0-2 .9-2 2-2s-.9 2-2 2-2zm12.01 0L4 19c-1.1 0-2 .9-2 2-2s-.9 2-2 2-2z"/>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className={styles.features}>
          <h2>What can Klara help you with?</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>🏠 Property Search</h3>
              <p>Find hotels, apartments, and unique stays across Georgia</p>
            </div>
            <div className={styles.featureCard}>
              <h3>💰 Pricing Info</h3>
              <p>Get detailed pricing and availability information</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🗺️ Local Recommendations</h3>
              <p>Discover hidden gems and authentic experiences</p>
            </div>
            <div className={styles.featureCard}>
              <h3>📅 Booking Help</h3>
              <p>Assistance with reservations and modifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
