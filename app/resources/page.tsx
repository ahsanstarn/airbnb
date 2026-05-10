'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './resources.module.css';

export default function ResourcesPage() {
  const resources = [
    {
      title: 'Georgian Hospitality Guide',
      desc: 'Learn the secrets of traditional Georgian hospitality and how to provide a world-class supra experience for your guests.',
      icon: '🍷',
      link: '#'
    },
    {
      title: 'Legal & Tax Basics',
      desc: 'Everything you need to know about registering your tourism business in Georgia and handling taxes correctly.',
      icon: '⚖️',
      link: '#'
    },
    {
      title: 'Photography Tips',
      desc: 'A guide on how to take stunning photos of your property that will stand out in the Kaya.ge search results.',
      icon: '📸',
      link: '#'
    },
    {
      title: 'Managing Seasonal Demand',
      desc: 'Strategies for maximizing your bookings during the peak summer in Batumi and winter seasons in Gudauri.',
      icon: '🏔️',
      link: '#'
    },
    {
      title: 'Kaya AI Optimization',
      desc: 'Learn how to use KLARA AI to optimize your listing description and reach more international travelers.',
      icon: '🤖',
      link: '#'
    },
    {
      title: 'Sustainability in Tourism',
      desc: 'How to make your guest house eco-friendly and attract the growing number of conscious travelers visiting Georgia.',
      icon: '🌿',
      link: '#'
    }
  ];

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Host Resources</h1>
            <p className={styles.subtitle}>
              Everything you need to build and grow your tourism business in Georgia.
            </p>
          </header>

          <div className={styles.grid}>
            {resources.map((res) => (
              <div key={res.title} className={styles.card}>
                <div className={styles.icon}>{res.icon}</div>
                <h3 className={styles.cardTitle}>{res.title}</h3>
                <p className={styles.cardDesc}>{res.desc}</p>
                <a href={res.link} className={styles.link}>
                  Read Guide <span>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
