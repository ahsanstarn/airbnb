'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BookingFlow({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [step, setStep] = useState<'dates' | 'details' | 'payment' | 'confirmation'>('dates');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [listing, setListing] = useState<any>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadListing() {
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setListing(data);
        } else {
          setError('Listing not found');
        }
      } catch {
        setError('Failed to load listing');
      } finally {
        setPageLoading(false);
      }
    }
    loadListing();
  }, [params.id]);

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 0;
  const price = listing?.price_per_night || 0;
  const subtotal = nights * price;
  const serviceFee = Math.round(subtotal * 0.08);
  const discount = nights >= 7 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + serviceFee - discount;
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'dates') { if (checkIn && checkOut) setStep('details'); return; }
    if (step === 'details') { setStep('payment'); return; }
    if (step === 'payment') {
      const token = localStorage.getItem('kaya_token');
      if (!token) { router.push('/login'); return; }
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            listing_id: params.id,
            check_in: checkIn,
            check_out: checkOut,
            guest_count: guestCount,
            payment_method: paymentMethod,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setBookingId(data.id);
          setStep('confirmation');
        } else {
          const err = await res.json();
          setError(err.error || 'Booking failed');
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const nav = (
    <div className="sticky-nav-shell visible" style={{ top: '54px', transform: 'translateX(-50%)' }}>
      <nav className="nav nav-sticky-bar" style={{ transform: 'scale(1.08)' }}>
        <Link href="/" className="nav-brand"><span className="brandmark-dot"></span><span>kaya<span style={{ opacity: 0.6 }}>.ge</span></span></Link>
        <button className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu"><span></span><span></span><span></span></button>
        <div className="nav-links"><Link href="/klara">KLARA</Link><Link href="/search">Visitors</Link><Link href="/hotels">Stays</Link><Link href="/muse">Where to go</Link><Link href="/contact">Contact us</Link></div>
      </nav>
    </div>
  );

  const glass = { borderRadius: '24px', padding: '36px 32px', background: 'rgba(255,251,246,.84)', border: '1px solid hsla(0,0%,100%,.35)', backdropFilter: 'blur(24px) saturate(120%)', boxShadow: '0 40px 80px rgba(48,26,16,0.12)' };

  const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(36,23,18,.12)', background: 'hsla(0,0%,100%,.84)', fontSize: '13px', outline: 'none' };

  if (pageLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #f8f1ea, #efe3d6, #f5ece3, #fdf7f0)' }}><p style={{ color: 'rgba(36,23,18,.58)' }}>Loading listing…</p></div>;

  if (error && !listing) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #f8f1ea, #efe3d6, #f5ece3, #fdf7f0)' }}>{nav}<main style={{ maxWidth: '560px', margin: '0 auto', padding: '120px 24px 60px', textAlign: 'center' }}><h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.5rem' }}>Listing not found</h2><p style={{ color: 'var(--muted)' }}>{error}</p><Link href="/search" style={{ display: 'inline-block', marginTop: '16px', padding: '14px 32px', borderRadius: '999px', background: '#1a120e', color: '#fff8ef', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>Browse listings</Link></main></div>;

  if (step === 'confirmation') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f8f1ea, #efe3d6, #f5ece3, #fdf7f0)' }}>
        {nav}
        <main style={{ maxWidth: '560px', margin: '0 auto', padding: '120px 24px 60px' }}>
          <div style={glass}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#22c55e', display: 'grid', placeItems: 'center', margin: '0 auto 20px', fontSize: '32px', color: '#fff8ef' }}>✓</div>
              <h1 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.8rem', fontWeight: 700, margin: '0 0 8px' }}>Booking Confirmed!</h1>
              <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '0 0 24px' }}>Your reservation at {listing?.title} is confirmed.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', borderRadius: '16px', background: 'rgba(255,252,247,.9)', border: '1px solid rgba(26,18,14,.06)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: 'var(--muted)' }}>Check-in</span><span style={{ fontWeight: 600 }}>{checkIn}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: 'var(--muted)' }}>Check-out</span><span style={{ fontWeight: 600 }}>{checkOut}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: 'var(--muted)' }}>Guests</span><span style={{ fontWeight: 600 }}>{guestCount}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: 'var(--muted)' }}>Total charged</span><span style={{ fontWeight: 800, fontSize: '16px' }}>₾{total}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: 'var(--muted)' }}>Payment</span><span style={{ fontWeight: 600 }}>{paymentMethod === 'card' ? 'Card' : 'Cash on arrival'}</span></div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center', margin: '0 0 20px' }}>A confirmation email has been sent to your email address.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/dashboard/bookings" style={{ flex: 1, textAlign: 'center', padding: '14px', borderRadius: '999px', background: '#1a120e', color: '#fff8ef', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>View My Bookings</Link>
              <Link href="/search" style={{ flex: 1, textAlign: 'center', padding: '14px', borderRadius: '999px', border: '1px solid rgba(26,18,14,.1)', background: 'rgba(255,251,246,.7)', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }}>Continue Exploring</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f8f1ea, #efe3d6, #f5ece3, #fdf7f0)' }}>
      {nav}
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '120px 24px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
          {['dates', 'details', 'payment'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: step === s ? '#1a120e' : ['dates', 'details', 'payment'].indexOf(step) > i ? '#22c55e' : 'rgba(26,18,14,.08)', color: step === s || ['dates', 'details', 'payment'].indexOf(step) > i ? '#fff8ef' : 'var(--muted)', fontSize: '13px', fontWeight: 700, transition: 'all .3s' }}>{i + 1}</div>
              {i < 2 && <div style={{ width: '40px', height: '2px', background: ['dates', 'details', 'payment'].indexOf(step) > i ? '#22c55e' : 'rgba(26,18,14,.1)', borderRadius: '1px', transition: 'all .3s' }} />}
            </div>
          ))}
        </div>

        {error && <div style={{ padding: '12px 16px', borderRadius: '14px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', color: '#dc2626', fontSize: '13px', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
          <div style={glass}>
            <form onSubmit={handleSubmit}>
              {step === 'dates' && (
                <>
                  <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 20px' }}>Select your dates</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Check-in</label>
                      <input type="date" value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)} required style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Check-out</label>
                      <input type="date" value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)} required style={inputStyle} />
                    </div>
                  </div>
                  <button type="submit" disabled={!checkIn || !checkOut} style={{
                    width: '100%', padding: '16px', borderRadius: '999px', border: '0',
                    background: !checkIn || !checkOut ? 'rgba(26,18,14,.3)' : '#1a120e',
                    color: '#fff8ef', fontSize: '15px', fontWeight: 800, cursor: !checkIn || !checkOut ? 'not-allowed' : 'pointer',
                  }}>Continue</button>
                </>
              )}

              {step === 'details' && (
                <>
                  <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 20px' }}>Guest details</h2>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Number of guests</label>
                    <select value={guestCount} onChange={e => setGuestCount(Number(e.target.value))} style={inputStyle}>
                      {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(236,198,166,.2)', fontSize: '13px', color: '#7a4530', lineHeight: 1.6, marginBottom: '20px' }}>
                    <strong>Cancellation policy:</strong> Free cancellation up to 24 hours before check-in.
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '16px', borderRadius: '999px', border: '0', background: '#1a120e', color: '#fff8ef', fontSize: '15px', fontWeight: 800, cursor: 'pointer' }}>Continue to Payment</button>
                </>
              )}

              {step === 'payment' && (
                <>
                  <h2 style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 20px' }}>Payment method</h2>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    {['card', 'cash'].map(m => (
                      <button key={m} type="button" onClick={() => setPaymentMethod(m)} style={{
                        flex: 1, padding: '14px', borderRadius: '14px', border: paymentMethod === m ? '2px solid #1a120e' : '1px solid rgba(26,18,14,.12)',
                        background: paymentMethod === m ? 'rgba(26,18,14,.03)' : 'hsla(0,0%,100%,.84)', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                        transition: 'all .2s',
                      }}>
                        {m === 'card' ? '💳 Card Payment' : '💵 Cash on Arrival'}
                      </button>
                    ))}
                  </div>
                  {paymentMethod === 'card' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Card Number</label>
                        <input value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19))} placeholder="4242 4242 4242 4242" style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Cardholder Name</label>
                        <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="John Smith" style={inputStyle} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>Expiry</label>
                          <input value={cardExpiry} onChange={e => { let v = e.target.value.replace(/\D/g, ''); if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4); setCardExpiry(v); }} placeholder="MM/YY" maxLength={5} style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(36,23,18,.6)' }}>CVC</label>
                          <input value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" style={inputStyle} />
                        </div>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'cash' && (
                    <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(236,198,166,.2)', fontSize: '13px', color: '#7a4530', lineHeight: 1.6, marginBottom: '20px' }}>
                      You&apos;ll pay in cash at the property. Your booking is confirmed, but no payment is processed online.
                    </div>
                  )}
                  <button type="submit" disabled={loading} style={{
                    width: '100%', padding: '16px', borderRadius: '999px', border: '0',
                    background: loading ? 'rgba(26,18,14,.6)' : '#1a120e',
                    color: '#fff8ef', fontSize: '15px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
                  }}>
                    {loading ? 'Processing…' : `Confirm & Pay ₾${total}`}
                  </button>
                </>
              )}
            </form>
          </div>

          <div style={{ ...glass, padding: '24px', position: 'sticky', top: '120px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '64px', height: '48px', borderRadius: '10px', background: `url(${listing?.images?.[0] || ''}) 50%/cover`, flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '14px', display: 'block' }}>{listing?.title}</strong>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>★ {listing?.overall_rating || '—'} · {listing?.location}</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(26,18,14,.08)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span>₾{price} × {nights || 1} night{nights !== 1 ? 's' : ''}</span>
                <span>₾{subtotal || price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span>Service fee</span>
                <span>₾{serviceFee || Math.round(price * 0.08)}</span>
              </div>
              {nights >= 7 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#22c55e' }}>
                  <span>Long stay discount</span>
                  <span>-₾{discount}</span>
                </div>
              )}
            </div>
            <div style={{ borderTop: '1px solid rgba(26,18,14,.08)', paddingTop: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800 }}>
                <span>Total</span>
                <span>₾{total || price}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
