'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '10rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Terms of Service</h1>
        <p style={{ lineHeight: 1.6, color: '#444' }}>
          By using Kaya.ge, you agree to follow our community guidelines and respect the 
          traditional hospitality values of Sakartvelo.
          <br /><br />
          Hosts must provide accurate information about their listings, and guests are expected 
          to respect the properties and local culture during their stay.
        </p>
      </main>
      <Footer />
    </>
  );
}
