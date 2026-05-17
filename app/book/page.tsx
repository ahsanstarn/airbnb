'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BookingRedirect() {
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #f8f1ea, #efe3d6, #f5ece3, #fdf7f0)' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>Select a listing to book</p>
        <Link href="/search" style={{ padding: '14px 32px', borderRadius: '999px', background: '#1a120e', color: '#fff8ef', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>Browse listings</Link>
      </div>
    </div>
  );
}
