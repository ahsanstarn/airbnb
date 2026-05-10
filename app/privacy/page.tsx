'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '10rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Privacy Policy</h1>
        <p style={{ lineHeight: 1.6, color: '#444' }}>
          Your privacy is important to us. At Kaya.ge, we are committed to protecting your personal data 
          and being transparent about how we collect and use it.
          <br /><br />
          This policy explains our practices regarding your information and how it helps us provide 
          a better travel experience for you.
        </p>
      </main>
      <Footer />
    </>
  );
}
