import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './muse.module.css';

const regions = [
  { name: 'Tbilisi', desc: 'The vibrant capital where East meets West', img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop', listings: 1200 },
  { name: 'Batumi', desc: 'Black Sea resort city with modern architecture', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop', listings: 800 },
  { name: 'Kakheti', desc: "The cradle of wine — Georgia's vineyard heartland", img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&h=300&fit=crop', listings: 450 },
  { name: 'Kazbegi', desc: 'Dramatic mountains and the iconic Gergeti Church', img: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&h=300&fit=crop', listings: 200 },
  { name: 'Kutaisi', desc: 'Ancient capital with caves and monasteries', img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop', listings: 300 },
  { name: 'Mestia', desc: 'Medieval towers in the heart of Svaneti', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop', listings: 150 },
];

const phrases = [
  { ka: 'გამარჯობა', en: 'Gamarjoba', meaning: 'Hello' },
  { ka: 'მადლობა', en: 'Madloba', meaning: 'Thank you' },
  { ka: 'გაუმარჯოს', en: 'Gaumarjos', meaning: 'Cheers! (toast)' },
  { ka: 'კი / არა', en: 'Ki / Ara', meaning: 'Yes / No' },
  { ka: 'რამდენი ღირს?', en: 'Ramdeni ghirs?', meaning: 'How much does it cost?' },
  { ka: 'სად არის...?', en: 'Sad aris...?', meaning: 'Where is...?' },
  { ka: 'კარგად', en: 'Kargad', meaning: 'Good / Well' },
  { ka: 'ბოდიში', en: 'Bodishi', meaning: 'Sorry / Excuse me' },
];

const essentials = [
  { icon: '🚨', title: 'Emergency', info: 'Dial 112 for police, ambulance, or fire' },
  { icon: '💱', title: 'Currency', info: 'Georgian Lari (GEL ₾). Cards accepted widely in cities.' },
  { icon: '⛪', title: 'Churches', info: 'Cover shoulders and knees. Headscarves for women.' },
  { icon: '🍷', title: 'Wine', info: "8,000 years of winemaking. Try qvevri wines!" },
  { icon: '🚕', title: 'Transport', info: 'Use Bolt app for taxis. Marshrutkas for intercity.' },
  { icon: '💰', title: 'Tipping', info: '10% in restaurants. Not expected in taxis.' },
  { icon: '🔌', title: 'Power', info: 'Type C/F plugs, 220V. Same as Europe.' },
  { icon: '🌡️', title: 'Weather', info: 'Best: May-June, Sep-Oct. Winters cold in mountains.' },
];

export default function MusePage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <h1 className={styles.heroTitle}>Discover Georgia</h1>
            <p className={styles.heroDesc}>Your complete guide to traveling in the country where Europe meets Asia</p>
          </div>
        </section>

        {/* Regions */}
        <section className={`${styles.section} container`}>
          <h2 className={styles.sectionTitle}>Explore by Region</h2>
          <div className={styles.regionsGrid}>
            {regions.map(r => (
              <Link key={r.name} href={`/search?region=${r.name}`} className={styles.regionCard}>
                <div className={styles.regionImg}>
                  <Image src={r.img} alt={r.name} fill sizes="(max-width:768px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
                </div>
                <div className={styles.regionInfo}>
                  <h3>{r.name}</h3>
                  <p>{r.desc}</p>
                  <span className={styles.regionCount}>{r.listings} listings</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="container"><hr className="divider" /></div>

        {/* Phrasebook */}
        <section className={`${styles.section} container`} id="phrasebook">
          <h2 className={styles.sectionTitle}>Georgian Phrasebook</h2>
          <p className={styles.sectionDesc}>Essential phrases to get by — locals will love you for trying!</p>
          <div className={styles.phrasesGrid}>
            {phrases.map(p => (
              <div key={p.en} className={styles.phrase}>
                <div className={styles.phraseKa}>{p.ka}</div>
                <div className={styles.phraseEn}>{p.en}</div>
                <div className={styles.phraseMeaning}>{p.meaning}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="container"><hr className="divider" /></div>

        {/* Essentials */}
        <section className={`${styles.section} container`}>
          <h2 className={styles.sectionTitle}>Travel Essentials</h2>
          <div className={styles.essentialsGrid}>
            {essentials.map(e => (
              <div key={e.title} className={styles.essential}>
                <span className={styles.essentialIcon}>{e.icon}</span>
                <div>
                  <strong>{e.title}</strong>
                  <p>{e.info}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
