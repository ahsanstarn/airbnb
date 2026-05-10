'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './blog.module.css';

export default function BlogPage() {
  const posts = [
    { title: 'Top 10 Hidden Gems in Kazbegi', category: 'Travel', date: 'May 10, 2025' },
    { title: 'How to Host the Perfect Georgian Supra', category: 'Culture', date: 'May 8, 2025' },
    { title: 'Summer in Batumi: A Locals Guide', category: 'Guides', date: 'May 5, 2025' },
    { title: 'The Rise of Digital Nomads in Tbilisi', category: 'News', date: 'May 1, 2025' }
  ];

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Kaya Blog</h1>
            <p className={styles.subtitle}>Stories, guides, and news from the heart of Georgia.</p>
          </header>
          
          <div className={styles.grid}>
            {posts.map((post) => (
              <div key={post.title} className={styles.card}>
                <div className={styles.img}></div>
                <div className={styles.content}>
                  <span className={styles.cat}>{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
