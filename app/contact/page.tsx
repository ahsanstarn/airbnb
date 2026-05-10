'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './contact.module.css';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>How can we help?</h1>
          <p className={styles.subtitle}>Get in touch with our team in Tbilisi.</p>
          
          <div className={styles.grid}>
            <div className={styles.info}>
              <div className={styles.item}>
                <h3>Support</h3>
                <p>support@kaya.ge</p>
              </div>
              <div className={styles.item}>
                <h3>Office</h3>
                <p>12 Rustaveli Ave, Tbilisi, Georgia</p>
              </div>
              <div className={styles.item}>
                <h3>Phone</h3>
                <p>+995 32 2XX XXXX</p>
              </div>
            </div>
            
            <form className={styles.form}>
              <input type="text" placeholder="Your Name" />
              <input type="email" placeholder="Your Email" />
              <textarea placeholder="How can we help you?"></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
