'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';
import styles from './cars.module.css';

const cars = [
  { id: 1, name: 'Toyota Hilux 4x4', type: 'Off-road', price: 150, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop' },
  { id: 2, name: 'Lexus GX470', type: 'Luxury SUV', price: 200, img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop' },
  { id: 3, name: 'Hyundai Elantra', type: 'Economy', price: 80, img: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=600&h=400&fit=crop' },
  { id: 4, name: 'Mitsubishi Delica', type: 'Van / 4x4', price: 120, img: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&h=400&fit=crop' },
];

export default function CarsPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Car Rentals in Georgia</h1>
            <p className={styles.subtitle}>Explore Sakartvelo at your own pace. From Tbilisi to the mountains.</p>
          </header>

          <div className={styles.grid}>
            {cars.map((car) => (
              <div key={car.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image src={car.img} alt={car.name} fill className={styles.image} />
                </div>
                <div className={styles.content}>
                  <div className={styles.row}>
                    <h3 className={styles.name}>{car.name}</h3>
                    <span className={styles.type}>{car.type}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>₾{car.price}</span>
                    <span className={styles.unit}> / day</span>
                  </div>
                  <button className={styles.btn}>Book Now</button>
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
