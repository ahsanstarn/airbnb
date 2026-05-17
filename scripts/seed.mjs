import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import WebSocket from 'ws';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { transport: WebSocket },
});

async function createUser(email, password, metadata) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });
  if (error) {
    // User might already exist — try to fetch them
    console.log(`  Note: ${error.message}, trying to fetch existing user...`);
    const { data: existing } = await supabase.auth.admin.listUsers();
    const user = existing?.users?.find(u => u.email === email);
    if (user) {
      console.log(`  Found existing user: ${email} (${user.id})`);
      return user;
    }
    throw error;
  }
  console.log(`  Created user: ${email} (${data.user.id})`);
  return data.user;
}

async function seed() {
  console.log('=== KAYA.GE Seed Script ===\n');

  // 0. Clean up existing seed data
  console.log('Cleaning up existing data...');
  const tables = ['agency_requests', 'ecommerce_products', 'ai_chat_history', 'muse_articles', 'featured_boosts', 'subscriptions', 'messages', 'reviews', 'availability_blocks', 'bookings', 'listings', 'businesses'];
  for (const t of tables) {
    await supabase.from(t).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }
  console.log('  Cleanup complete.\n');

  // 1. Create auth users
  console.log('Creating users...');
  const giorgi = await createUser('giorgi@test.com', 'Test123!', { name: 'Giorgi Beridze', nationality: 'Georgia' });
  const nino = await createUser('nino@test.com', 'Test123!', { name: 'Nino Kvrivishvili', nationality: 'Georgia' });
  const hotelBiz = await createUser('business@test.com', 'Test123!', { name: 'Davit Kapanadze', nationality: 'Georgia' });
  const tourBiz = await createUser('tours@test.com', 'Test123!', { name: 'Mariam Gotsiridze', nationality: 'Georgia' });
  const restaurantBiz = await createUser('restaurant@test.com', 'Test123!', { name: 'Levan Mchedlidze', nationality: 'Georgia' });
  const carBiz = await createUser('cars@test.com', 'Test123!', { name: 'Zurab Jorjadze', nationality: 'Georgia' });
  console.log('');

  // 2. Create businesses
  console.log('Creating businesses...');
  const businesses = [
    { user_id: hotelBiz.id, name: 'Tbilisi Boutique Hotel', category: 'hotels', description: 'Luxury boutique hotel in the heart of Tbilisi with stunning city views and traditional Georgian hospitality.', address: '12 Rustaveli Ave', city: 'Tbilisi', latitude: 41.709, longitude: 44.792, phone: '+995 32 200 1010', website: 'https://tbilisiboutique.ge', is_verified: true, subscription_plan: 'PREMIUM', subscription_status: 'ACTIVE' },
    { user_id: tourBiz.id, name: 'Caucasus Explorer Tours', category: 'tours', description: 'Expert-guided tours across Georgia, Armenia, and Azerbaijan. Hiking, wine tours, and cultural experiences.', address: '45 Pushkin St', city: 'Tbilisi', latitude: 41.724, longitude: 44.788, phone: '+995 599 101 202', website: 'https://caucasusexplorer.ge', is_verified: true, subscription_plan: 'PREMIUM', subscription_status: 'ACTIVE' },
    { user_id: restaurantBiz.id, name: 'Sakhli #1 Restaurant', category: 'restaurants', description: 'Authentic Georgian cuisine in a cozy traditional setting. Our khinkali and khachapuri are award-winning.', address: '23 Shardeni St', city: 'Tbilisi', latitude: 41.691, longitude: 44.805, phone: '+995 32 222 3344', website: 'https://sakhli.ge', is_verified: true, subscription_plan: 'BASIC', subscription_status: 'ACTIVE' },
    { user_id: restaurantBiz.id, name: 'Batumi Seafood House', category: 'restaurants', description: 'Fresh Black Sea seafood with panoramic ocean views. The best Adjarian khachapuri in Batumi.', address: '8 Seaside Blvd', city: 'Batumi', latitude: 41.637, longitude: 41.635, phone: '+995 422 123 456', website: null, is_verified: true, subscription_plan: 'BASIC', subscription_status: 'ACTIVE' },
    { user_id: carBiz.id, name: 'GeoDrive Rentals', category: 'cars', description: 'Premium car rental service in Tbilisi and Batumi. SUVs, sedans, and luxury vehicles available.', address: '90 Tsereteli Ave', city: 'Tbilisi', latitude: 41.736, longitude: 44.776, phone: '+995 555 333 444', website: 'https://geodrive.ge', is_verified: true, subscription_plan: 'BASIC', subscription_status: 'ACTIVE' },
    { user_id: hotelBiz.id, name: 'Kazbegi Panorama Resort', category: 'hotels', description: 'Mountain resort with breathtaking views of Mount Kazbek. Spa, restaurant, and guided hikes.', address: '1 Kazbegi St', city: 'Kazbegi', latitude: 42.657, longitude: 44.642, phone: '+995 599 444 555', website: 'https://kazbegipanorama.ge', is_verified: true, subscription_plan: 'PREMIUM', subscription_status: 'ACTIVE' },
    { user_id: tourBiz.id, name: 'Kakheti Wine Tours', category: 'tours', description: 'Explore Georgia\'s famous wine region. Visit family-run wineries, taste qvevri wines, and learn traditional winemaking.', address: '12 Chavchavadze St', city: 'Signagi', latitude: 41.619, longitude: 45.921, phone: '+995 577 555 666', website: 'https://kakhetiwinetours.ge', is_verified: true, subscription_plan: 'BASIC', subscription_status: 'ACTIVE' },
    { user_id: hotelBiz.id, name: 'Batumi Luxury Suites', category: 'hotels', description: 'Beachfront luxury suites with private pools, spa, and fine dining. Perfect for a seaside getaway.', address: '25 Seaside Blvd', city: 'Batumi', latitude: 41.639, longitude: 41.638, phone: '+995 422 777 888', website: 'https://batumiluxury.ge', is_verified: false, subscription_plan: 'BASIC', subscription_status: 'ACTIVE' },
  ];

  const bizIds = [];
  for (const b of businesses) {
    const { data, error } = await supabase.from('businesses').insert(b).select().single();
    if (error) { console.error(`  Error creating business ${b.name}:`, error.message); continue; }
    bizIds.push(data.id);
    console.log(`  Created business: ${b.name} (${data.id})`);
  }
  console.log('');

  // 3. Create listings
  console.log('Creating listings...');
  const listings = [
    { business_id: bizIds[0], title: 'Panoramic Suite with City View', description: 'Elegant suite on the top floor with panoramic views of Tbilisi. King bed, marble bathroom, private balcony.', category: 'hotels', price_per_night: 280, location: 'Tbilisi, Georgia', images: ['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&h=700&fit=crop', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=700&fit=crop'], amenities: ['wifi', 'parking', 'breakfast', 'ac'], overall_rating: 4.96, review_count: 128, is_featured: true },
    { business_id: bizIds[0], title: 'Deluxe Double Room Rustaveli', description: 'Centrally located deluxe room on Rustaveli Avenue. Walking distance to all major attractions.', category: 'hotels', price_per_night: 195, location: 'Tbilisi, Georgia', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=700&fit=crop'], amenities: ['wifi', 'breakfast', 'ac'], overall_rating: 4.91, review_count: 94, is_featured: false },
    { business_id: bizIds[1], title: 'Full-Day Kazbegi Mountain Tour', description: 'Guided tour to Kazbegi including Gergeti Trinity Church, panoramic views, and traditional lunch.', category: 'tours', price_per_night: 85, location: 'Tbilisi → Kazbegi', images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=900&h=700&fit=crop'], amenities: ['guide', 'lunch', 'transport', 'photos'], overall_rating: 4.88, review_count: 203, is_featured: true },
    { business_id: bizIds[1], title: 'Tbilisi Walking Food Tour', description: 'Sample the best of Tbilisi street food and traditional dishes. Visit 8 locations in Old Town.', category: 'tours', price_per_night: 55, location: 'Tbilisi, Old Town', images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900&h=700&fit=crop'], amenities: ['guide', 'food', 'drinks'], overall_rating: 4.85, review_count: 167, is_featured: false },
    { business_id: bizIds[2], title: 'Traditional Khinkali & Khachapuri Masterclass', description: 'Learn to make Georgia\'s most famous dishes from our master chef. Includes lunch with wine pairing.', category: 'restaurants', price_per_night: 45, location: 'Tbilisi, Old Town', images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&h=700&fit=crop'], amenities: ['cooking', 'wine', 'vegan-options'], overall_rating: 4.93, review_count: 312, is_featured: true },
    { business_id: bizIds[2], title: 'Wine Dinner Experience', description: 'Exclusive 5-course dinner with Georgian wine pairings in our private dining room.', category: 'restaurants', price_per_night: 75, location: 'Tbilisi, Georgia', images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&h=700&fit=crop'], amenities: ['wine', 'dinner', 'private'], overall_rating: 4.89, review_count: 88, is_featured: false },
    { business_id: bizIds[3], title: 'Seaside Dining Experience', description: 'Fresh catch of the day prepared in traditional Adjarian style. Ocean-view terrace seating.', category: 'restaurants', price_per_night: 60, location: 'Batumi, Georgia', images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&h=700&fit=crop'], amenities: ['seafood', 'ocean-view', 'wine'], overall_rating: 4.72, review_count: 145, is_featured: false },
    { business_id: bizIds[4], title: 'SUV Mountain Adventure Package', description: 'Toyota Land Cruiser Prado for 3 days. Perfect for mountain roads and off-road exploration.', category: 'cars', price_per_night: 120, location: 'Tbilisi, Georgia', images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=700&fit=crop'], amenities: ['gps', 'insurance', 'child-seat'], overall_rating: 4.82, review_count: 76, is_featured: false },
    { business_id: bizIds[4], title: 'Economy Sedan Daily Rental', description: 'Reliable Toyota Corolla. Perfect for city driving. Manual transmission, air conditioning, Bluetooth.', category: 'cars', price_per_night: 45, location: 'Tbilisi, Georgia', images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&h=700&fit=crop'], amenities: ['gps', 'insurance', 'ac'], overall_rating: 4.78, review_count: 234, is_featured: false },
    { business_id: bizIds[5], title: 'Kazbegi View Suite', description: 'Corner suite with floor-to-ceiling windows facing Mount Kazbek. Fireplace, spa bathtub, and private terrace.', category: 'hotels', price_per_night: 420, location: 'Kazbegi, Georgia', images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&h=700&fit=crop'], amenities: ['wifi', 'fireplace', 'spa', 'breakfast', 'parking'], overall_rating: 4.97, review_count: 89, is_featured: true },
    { business_id: bizIds[6], title: 'Signagi Wine Trail Half-Day Tour', description: 'Visit 3 family wineries in the Sighnaghi region. Taste qvevri-aged wines and learn traditional methods.', category: 'tours', price_per_night: 65, location: 'Signagi, Kakheti', images: ['https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&h=700&fit=crop'], amenities: ['guide', 'transport', 'wine', 'lunch'], overall_rating: 4.91, review_count: 178, is_featured: false },
    { business_id: bizIds[7], title: 'Beachfront Premium Suite', description: 'Modern suite with direct beach access, private plunge pool, and butler service.', category: 'hotels', price_per_night: 350, location: 'Batumi, Georgia', images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&h=700&fit=crop'], amenities: ['pool', 'wifi', 'breakfast', 'spa', 'butler'], overall_rating: 4.69, review_count: 56, is_featured: false },
  ];

  const listingIds = [];
  for (const l of listings) {
    const { data, error } = await supabase.from('listings').insert(l).select().single();
    if (error) { console.error(`  Error creating listing ${l.title}:`, error); continue; }
    listingIds.push(data.id);
    console.log(`  Created listing: ${l.title} (${data.id})`);
  }
  console.log('');

  // 4. Create bookings
  console.log('Creating bookings...');
  const now = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];
  const addDays = (date, n) => { const r = new Date(date); r.setDate(r.getDate() + n); return r; };

  const bookings = [
    { listing_id: listingIds[0], tourist_id: giorgi.id, check_in: fmt(addDays(now, 10)), check_out: fmt(addDays(now, 13)), guest_count: 2, total_price: 840, status: 'CONFIRMED', payment_status: 'PAID', payment_method: 'card' },
    { listing_id: listingIds[2], tourist_id: nino.id, check_in: fmt(addDays(now, 5)), check_out: fmt(addDays(now, 6)), guest_count: 1, total_price: 85, status: 'CONFIRMED', payment_status: 'PAID', payment_method: 'card' },
    { listing_id: listingIds[9], tourist_id: giorgi.id, check_in: fmt(addDays(now, -30)), check_out: fmt(addDays(now, -27)), guest_count: 2, total_price: 1260, status: 'COMPLETED', payment_status: 'PAID', payment_method: 'cash' },
    { listing_id: listingIds[4], tourist_id: nino.id, check_in: fmt(addDays(now, 20)), check_out: fmt(addDays(now, 20)), guest_count: 2, total_price: 45, status: 'PENDING', payment_status: 'PENDING', payment_method: null },
    { listing_id: listingIds[7], tourist_id: giorgi.id, check_in: fmt(addDays(now, -60)), check_out: fmt(addDays(now, -57)), guest_count: 1, total_price: 360, status: 'COMPLETED', payment_status: 'PAID', payment_method: 'card' },
    { listing_id: listingIds[1], tourist_id: nino.id, check_in: fmt(addDays(now, 15)), check_out: fmt(addDays(now, 17)), guest_count: 2, total_price: 390, status: 'CONFIRMED', payment_status: 'PAID', payment_method: 'card' },
    { listing_id: listingIds[10], tourist_id: giorgi.id, check_in: fmt(addDays(now, -15)), check_out: fmt(addDays(now, -15)), guest_count: 4, total_price: 65, status: 'COMPLETED', payment_status: 'PAID', payment_method: 'cash' },
    { listing_id: listingIds[3], tourist_id: nino.id, check_in: fmt(addDays(now, 25)), check_out: fmt(addDays(now, 25)), guest_count: 1, total_price: 55, status: 'PENDING', payment_status: 'PENDING', payment_method: null },
    { listing_id: listingIds[5], tourist_id: giorgi.id, check_in: fmt(addDays(now, -45)), check_out: fmt(addDays(now, -45)), guest_count: 2, total_price: 75, status: 'CANCELLED', payment_status: 'REFUNDED', payment_method: 'card' },
    { listing_id: listingIds[11], tourist_id: nino.id, check_in: fmt(addDays(now, 45)), check_out: fmt(addDays(now, 48)), guest_count: 2, total_price: 1050, status: 'PENDING', payment_status: 'PENDING', payment_method: null },
  ];

  const bookingIds = [];
  for (const b of bookings) {
    const { data, error } = await supabase.from('bookings').insert(b).select().single();
    if (error) { console.error(`  Error creating booking:`, error); continue; }
    bookingIds.push(data.id);
    console.log(`  Created booking: ${data.id}`);
  }
  console.log('');

  // 5. Create reviews
  console.log('Creating reviews...');
  const reviews = [
    { booking_id: bookingIds[2], tourist_id: giorgi.id, listing_id: listingIds[9], overall_rating: 5, cleanliness_rating: 5, location_rating: 5, value_rating: 4, text: 'Absolutely breathtaking views. The suite was immaculate, and the staff went above and beyond. Worth every lari!', is_published: true, business_reply: 'Thank you Giorgi! We hope to welcome you again soon.', business_reply_date: fmt(addDays(now, -27)) },
    { booking_id: bookingIds[4], tourist_id: giorgi.id, listing_id: listingIds[7], overall_rating: 4, cleanliness_rating: 4, location_rating: 5, value_rating: 4, text: 'Great SUV, handled the mountain roads perfectly. Only issue was pickup was 30 minutes late.', is_published: true, business_reply: 'Apologies for the delay, Giorgi. We\'ve improved our checkout process since then. Thank you!', business_reply_date: fmt(addDays(now, -55)) },
    { booking_id: bookingIds[6], tourist_id: giorgi.id, listing_id: listingIds[10], overall_rating: 5, cleanliness_rating: null, location_rating: null, value_rating: 5, text: 'Incredible wine tour! Mariam was so knowledgeable and the family wineries were magical. Highly recommend.', is_published: true, business_reply: null, business_reply_date: null },
    { booking_id: bookingIds[8], tourist_id: giorgi.id, listing_id: listingIds[5], overall_rating: 3, cleanliness_rating: 4, location_rating: 5, value_rating: 2, text: 'The wine dinner was good but overpriced for the portions. The atmosphere was lovely though.', is_published: true, business_reply: null, business_reply_date: null },
    { booking_id: bookingIds[0], tourist_id: giorgi.id, listing_id: listingIds[0], overall_rating: 5, cleanliness_rating: 5, location_rating: 5, value_rating: 5, text: 'Best hotel stay in Tbilisi! The panoramic view suite is exactly as pictured. Breakfast was delicious.', is_published: true, business_reply: null, business_reply_date: null },
    { booking_id: bookingIds[1], tourist_id: nino.id, listing_id: listingIds[2], overall_rating: 5, cleanliness_rating: null, location_rating: null, value_rating: 4, text: 'Kazbegi tour was the highlight of my trip. Our guide Giorgi was fantastic — so knowledgeable about the region!', is_published: true, business_reply: 'Thank you Nino! Giorgi sends his regards :)', business_reply_date: fmt(addDays(now, 2)) },
    { booking_id: bookingIds[5], tourist_id: nino.id, listing_id: listingIds[1], overall_rating: 4, cleanliness_rating: 4, location_rating: 5, value_rating: 4, text: 'Lovely room on Rustaveli. Very centrally located. The only downside was street noise at night.', is_published: true, business_reply: null, business_reply_date: null },
    { booking_id: bookingIds[3], tourist_id: nino.id, listing_id: listingIds[4], overall_rating: 4, cleanliness_rating: null, location_rating: null, value_rating: 4, text: 'Really fun cooking class! Learned to make khinkali properly. Would come again.', is_published: false, business_reply: null, business_reply_date: null },
  ];

  for (const r of reviews) {
    const { data, error } = await supabase.from('reviews').insert(r).select().single();
    if (error) { console.error(`  Error creating review:`, error); continue; }
    console.log(`  Created review: ${data.id}`);
  }
  console.log('');

  // 6. Create messages
  console.log('Creating messages...');
  const messages = [
    { booking_id: bookingIds[0], sender_id: giorgi.id, receiver_id: hotelBiz.id, text: 'Hello! Is early check-in possible on the 24th?', is_read: true, read_at: fmt(addDays(now, 8)) },
    { booking_id: bookingIds[0], sender_id: hotelBiz.id, receiver_id: giorgi.id, text: 'Hi Giorgi! Yes, early check-in at 12 PM is not a problem. We look forward to hosting you!', is_read: true, read_at: fmt(addDays(now, 8)) },
    { booking_id: bookingIds[1], sender_id: nino.id, receiver_id: tourBiz.id, text: 'What time does the Kazbegi tour start?', is_read: true, read_at: fmt(addDays(now, 3)) },
    { booking_id: bookingIds[1], sender_id: tourBiz.id, receiver_id: nino.id, text: 'We pick up from hotels between 7:00-7:30 AM. The drive takes about 3 hours with scenic stops.', is_read: false, read_at: null },
    { booking_id: bookingIds[3], sender_id: nino.id, receiver_id: restaurantBiz.id, text: 'Do you have vegetarian options for the cooking class?', is_read: true, read_at: fmt(addDays(now, 18)) },
    { booking_id: bookingIds[3], sender_id: restaurantBiz.id, receiver_id: nino.id, text: 'Absolutely! We have a full vegetarian menu. Just let us know when you arrive.', is_read: false, read_at: null },
    { booking_id: bookingIds[2], sender_id: giorgi.id, receiver_id: hotelBiz.id, text: 'Thank you for the amazing stay! We will definitely be back.', is_read: true, read_at: fmt(addDays(now, -25)) },
    { booking_id: bookingIds[2], sender_id: hotelBiz.id, receiver_id: giorgi.id, text: 'It was our pleasure! You were wonderful guests. See you next time :)', is_read: true, read_at: fmt(addDays(now, -25)) },
  ];

  for (const m of messages) {
    const { data, error } = await supabase.from('messages').insert(m).select().single();
    if (error) { console.error(`  Error creating message:`, error); continue; }
    console.log(`  Created message: ${data.id}`);
  }
  console.log('');

  // 7. Create subscriptions
  console.log('Creating subscriptions...');
  for (let i = 0; i < bizIds.length; i++) {
    const plan = businesses[i].subscription_plan;
    const amount = plan === 'PREMIUM' ? 50 : 20;
    const { data, error } = await supabase.from('subscriptions').insert({
      business_id: bizIds[i],
      plan,
      amount,
      currency: 'GEL',
      status: businesses[i].subscription_status,
      billing_cycle_start: fmt(addDays(now, -30)),
      next_billing_date: fmt(addDays(now, 30)),
    }).select().single();
    if (error) { console.error(`  Error creating subscription for biz ${i}:`, error); continue; }
    console.log(`  Created subscription for business ${i}: ${data.id}`);
  }
  console.log('');

  // 8. Create featured boosts
  console.log('Creating featured boosts...');
  const boosts = [
    { listing_id: listingIds[0], start_date: fmt(addDays(now, -15)), end_date: fmt(addDays(now, 15)), amount_paid: 100, status: 'ACTIVE' },
    { listing_id: listingIds[2], start_date: fmt(addDays(now, -30)), end_date: fmt(addDays(now, 30)), amount_paid: 150, status: 'ACTIVE' },
    { listing_id: listingIds[4], start_date: fmt(addDays(now, -10)), end_date: fmt(addDays(now, 20)), amount_paid: 80, status: 'ACTIVE' },
    { listing_id: listingIds[9], start_date: fmt(addDays(now, -45)), end_date: fmt(addDays(now, -15)), amount_paid: 120, status: 'EXPIRED' },
  ];

  for (const b of boosts) {
    const { data, error } = await supabase.from('featured_boosts').insert(b).select().single();
    if (error) { console.error(`  Error creating boost:`, error); continue; }
    console.log(`  Created boost: ${data.id}`);
  }
  console.log('');

  // 9. Create muse articles
  console.log('Creating muse articles...');
  const articles = [
    { title: 'Discover Tbilisi: A City of Contrasts', slug: 'discover-tbilisi', body: 'Tbilisi, the capital of Georgia, is a city where ancient history meets modern creativity. Wander through the cobblestone streets of the Old Town, soak in the sulfur baths, and ride the cable car to Narikala Fortress for panoramic views. The city is famous for its eclectic architecture, vibrant arts scene, and warm hospitality.', region: 'Tbilisi', category: 'city-guide', cover_image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&h=700&fit=crop', is_published: true },
    { title: 'The Art of Qvevri Winemaking', slug: 'qvevri-winemaking', body: 'Georgia is the cradle of wine, with 8,000 years of winemaking tradition. The qvevri, a clay vessel buried underground, is at the heart of this ancient craft. Visit Kakheti to see traditional wineries, taste amber wines, and experience the legendary Georgian supra (feast) where wine flows like a river.', region: 'Kakheti', category: 'food-wine', cover_image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&h=700&fit=crop', is_published: true },
    { title: 'Hiking in Svaneti: Towers and Glaciers', slug: 'hiking-svaneti', body: 'Svaneti, nestled in the Caucasus Mountains, is a hiker\'s paradise. The region is famous for its medieval stone towers, dramatic glaciers, and untouched nature. The trek to Shkhara Glacier and the hike around Ushguli, Europe\'s highest continuous settlement, are bucket-list experiences.', region: 'Svaneti', category: 'adventure', cover_image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=900&h=700&fit=crop', is_published: true },
    { title: 'Batumi: Georgia\'s Black Sea Pearl', slug: 'batumi-guide', body: 'Batumi is Georgia\'s premier seaside resort, offering a unique blend of subtropical nature, modern architecture, and old-world charm. Walk the seaside boulevard, visit the Batumi Botanical Garden, and enjoy fresh seafood at the many restaurants along the coast.', region: 'Adjara', category: 'city-guide', cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=700&fit=crop', is_published: true },
    { title: 'Georgian Cuisine: A Feast for the Senses', slug: 'georgian-cuisine', body: 'Georgian cuisine is a celebration of flavors, textures, and traditions. From the iconic khachapuri (cheese-filled bread) to the delicate khinkali (dumplings), every dish tells a story. Don\'t miss the walnut-based sauces, fresh herbs, and the legendary Georgian supra table culture.', region: 'All Georgia', category: 'food-wine', cover_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&h=700&fit=crop', is_published: true },
    { title: 'Guide to Georgian Sulfur Baths', slug: 'sulfur-baths-guide', body: 'Tbilisi\'s sulfur baths in the historic Abanotubani district are a must-visit. These natural hot springs have been used for centuries and are believed to have healing properties. The ornate bathhouses with their brick domes and mosaic interiors are architectural treasures.', region: 'Tbilisi', category: 'wellness', cover_image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&h=700&fit=crop', is_published: true },
  ];

  for (const a of articles) {
    const { data, error } = await supabase.from('muse_articles').insert(a).select().single();
    if (error) { console.error(`  Error creating article:`, error); continue; }
    console.log(`  Created article: ${a.title}`);
  }
  console.log('');

  // 10. Create AI chat history
  console.log('Creating AI chat history...');
  const chats = [
    { user_id: giorgi.id, session_id: 'session-001', message_text: 'Hello! What are the best places to visit in Georgia?', response_text: 'Hello! Georgia is full of amazing places. I recommend starting with Tbilisi\'s Old Town, then heading to Kazbegi for mountain views, Kakheti for wine tasting, and Batumi for the Black Sea coast. Each region offers a unique experience!', model: 'claude-sonnet-4-20250514' },
    { user_id: giorgi.id, session_id: 'session-001', message_text: 'What is the best time to visit?', response_text: 'The best time to visit Georgia depends on your interests: Spring (Apr-Jun) is perfect for city tours and wine regions, summer (Jul-Sep) is ideal for mountain hiking and the Black Sea coast, autumn (Oct-Nov) brings beautiful foliage and harvest season, winter (Dec-Feb) is great for skiing in Gudauri and Bakuriani.', model: 'claude-sonnet-4-20250514' },
    { user_id: nino.id, session_id: 'session-002', message_text: 'Tell me about Georgian wine!', response_text: 'Georgia is the cradle of winemaking with 8,000 years of tradition! Our unique qvevri method uses clay vessels buried underground. The Kakheti region is the heart of wine production. Must-try varieties include Saperavi (red), Rkatsiteli (white), and the amber/orange wines that are uniquely Georgian.', model: 'claude-sonnet-4-20250514' },
  ];

  for (const c of chats) {
    const { data, error } = await supabase.from('ai_chat_history').insert(c).select().single();
    if (error) { console.error(`  Error creating chat:`, error); continue; }
    console.log(`  Created chat: ${data.id}`);
  }
  console.log('');

  // 11. Create e-commerce products (Phase 2)
  console.log('Creating e-commerce products...');
  const products = [
    { name: 'Georgian Wine Set - 3 Bottles', description: 'Selection of premium Georgian wines: Saperavi, Rkatsiteli, and Amber wine. Perfect gift or souvenir.', price: 89, category: 'wine', stock: 25, images: ['https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&fit=crop'] },
    { name: 'Traditional Georgian Ceramics Set', description: 'Hand-painted ceramic plates and bowls made by artisans in Kakheti. Set of 6 pieces.', price: 45, category: 'crafts', stock: 15, images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&fit=crop'] },
    { name: 'Svaneti Wool Hat (Papanaki)', description: 'Authentic hand-woven wool hat from Svaneti region. Traditional design, warm and comfortable.', price: 35, category: 'clothing', stock: 40, images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&fit=crop'] },
    { name: 'Georgian Spice Collection', description: 'Set of 6 traditional Georgian spice blends including Svaneti salt, Khmeli Suneli, and more.', price: 22, category: 'food', stock: 60, images: ['https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&fit=crop'] },
    { name: 'Qvevri Miniature Wine Vessel', description: 'Handcrafted miniature qvevri clay vessel. Perfect decorative piece for wine lovers.', price: 18, category: 'crafts', stock: 30, images: ['https://images.unsplash.com/photo-1574680096145-d05b474f8e20?w=600&fit=crop'] },
    { name: 'Georgian Silk Scarf', description: 'Hand-dyed silk scarf with traditional Georgian patterns. Made in Tbilisi.', price: 55, category: 'clothing', stock: 20, images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&fit=crop'] },
    { name: 'Tbilisi City Guide Book', description: 'Comprehensive guide to Tbilisi with maps, restaurant recommendations, and historical context.', price: 15, category: 'books', stock: 100, images: ['https://images.unsplash.com/photo-1544716278-e513176f20b5?w=600&fit=crop'] },
    { name: 'Georgian Honey Set', description: 'Three premium honeys: chestnut, mountain flower, and acacia. Direct from Georgian beekeepers.', price: 28, category: 'food', stock: 45, images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&fit=crop'] },
  ];

  for (const p of products) {
    const { data, error } = await supabase.from('ecommerce_products').insert(p).select().single();
    if (error) { console.error(`  Error creating product:`, error); continue; }
    console.log(`  Created product: ${p.name}`);
  }
  console.log('');

  // 12. Create agency requests
  console.log('Creating agency requests...');
  const requests = [
    { business_id: bizIds[0], service_type: 'social_media', details: 'Need a social media strategy and content creation for our boutique hotel. Instagram, Facebook, TikTok.', status: 'IN_PROGRESS' },
    { business_id: bizIds[2], service_type: 'photography', details: 'Professional food photography for our new seasonal menu. Need about 20 photos.', status: 'PENDING' },
    { business_id: bizIds[4], service_type: 'website', details: 'Our car rental website needs a complete redesign with online booking system.', status: 'PENDING' },
    { business_id: bizIds[1], service_type: 'content_writing', details: 'Blog posts and SEO content for our tour company website. Need 5 articles about Georgian travel.', status: 'COMPLETED' },
  ];

  for (const r of requests) {
    const { data, error } = await supabase.from('agency_requests').insert(r).select().single();
    if (error) { console.error(`  Error creating agency request:`, error); continue; }
    console.log(`  Created agency request: ${r.service_type}`);
  }
  console.log('');

  // Done
  console.log('\n=== SEED COMPLETE ===');
  console.log('Test accounts:');
  console.log('  giorgi@test.com / Test123! (tourist)');
  console.log('  nino@test.com / Test123! (tourist)');
  console.log('  business@test.com / Test123! (hotel business owner)');
  console.log('  tours@test.com / Test123! (tour business owner)');
  console.log('  restaurant@test.com / Test123! (restaurant business owner)');
  console.log('  cars@test.com / Test123! (car rental business owner)');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
