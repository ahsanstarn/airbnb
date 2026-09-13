import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

const SEED_LISTINGS = [
  {
    title: 'Panoramic Suite with City & Fortress Views',
    description: 'Experience Tbilisi from above in this stunning panoramic suite with floor-to-ceiling windows overlooking Old Tbilisi and Narikala Fortress. Located in the charming Vera district, steps from galleries, cafes, and wine bars.',
    category: 'hotels',
    type: 'Entire suite',
    price_per_night: 280,
    currency: 'GEL',
    location: 'Tbilisi, Vera',
    city: 'Tbilisi',
    latitude: 41.7060,
    longitude: 44.7820,
    host: 'Nino Bakradze',
    beds: 2,
    baths: 1,
    guests: 4,
    amenities: ['WiFi', 'Kitchen', 'Free parking', 'Air conditioning', 'Balcony', 'City view', 'Elevator', 'Washing machine'],
    images: [
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.96,
    review_count: 127,
    views_count: 852,
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Wine Country Villa with Ancient Qvevri Cellar',
    description: 'Escape to Georgia\'s wine heartland in Kakheti. This charming villa sits among vineyards with views of the snow-peaked Caucasus and Alazani Valley. Includes private wine tastings and home-cooked breakfasts.',
    category: 'villas',
    type: 'Entire villa',
    price_per_night: 220,
    currency: 'GEL',
    location: 'Kakheti, Sighnaghi',
    city: 'Kakheti',
    latitude: 41.6200,
    longitude: 45.9228,
    host: 'Giorgi Mchedlishvili',
    beds: 3,
    baths: 2,
    guests: 6,
    amenities: ['WiFi', 'Kitchen', 'Wine cellar', 'Fireplace', 'Mountain view', 'Breakfast included', 'Free parking', 'Garden', 'BBQ'],
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.92,
    review_count: 94,
    views_count: 640,
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Kazbegi Alpine Lodge with Mount Kazbek Panorama',
    description: 'Wake up to the majestic Mount Kazbek and Gergeti Trinity Church. Cozy alpine wooden cabin with glass front, wood-burning stove, heated floors, and instant access to hiking trails.',
    category: 'cabins',
    type: 'Entire lodge',
    price_per_night: 190,
    currency: 'GEL',
    location: 'Kazbegi, Stepantsminda',
    city: 'Kazbegi',
    latitude: 42.6568,
    longitude: 44.6433,
    host: 'Dato Gujabidze',
    beds: 2,
    baths: 1,
    guests: 4,
    amenities: ['WiFi', 'Fireplace', 'Mountain view', 'Heating', 'Balcony', 'Free parking', 'Hiking trails', 'Hot water'],
    images: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.95,
    review_count: 81,
    views_count: 730,
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Modern Seaside Apartment on Batumi Boulevard',
    description: 'Bright beachfront flat overlooking the Black Sea and Batumi coastline. Steps from the famous boulevard promenade, seafood restaurants, bicycle paths, and dancing fountains.',
    category: 'apartments',
    type: 'Entire apartment',
    price_per_night: 130,
    currency: 'GEL',
    location: 'Batumi, Seaside Boulevard',
    city: 'Batumi',
    latitude: 41.6450,
    longitude: 41.6410,
    host: 'Salome Beridze',
    beds: 2,
    baths: 1,
    guests: 3,
    amenities: ['WiFi', 'Sea view', 'Air conditioning', 'Kitchen', 'Elevator', 'Washing machine', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.78,
    review_count: 53,
    views_count: 490,
    is_published: true,
    is_featured: false,
  },
  {
    title: 'Historic Carved Wooden Balcony House in Old Tbilisi',
    description: 'Charming 19th-century Georgian guesthouse with hand-carved fretwork balcony, brick walls, and shaded fig tree courtyard. Located in historic Sololaki near Freedom Square.',
    category: 'guesthouses',
    type: 'Entire house',
    price_per_night: 95,
    currency: 'GEL',
    location: 'Tbilisi, Sololaki',
    city: 'Tbilisi',
    latitude: 41.6915,
    longitude: 44.8010,
    host: 'Irakli Chkheidze',
    beds: 2,
    baths: 1,
    guests: 4,
    amenities: ['WiFi', 'Courtyard', 'Air conditioning', 'Kitchen', 'Historic features', 'Free tea & coffee'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.88,
    review_count: 110,
    views_count: 910,
    is_published: true,
    is_featured: false,
  },
  {
    title: 'Svaneti Medieval Tower Guesthouse in Mestia',
    description: 'Stay directly beside a 10th-century UNESCO Svan defense tower. Pristine mountain air, homemade Svan sulguni cheese and kubdari breakfasts, and hiking routes to Shkhara glacier.',
    category: 'guesthouses',
    type: 'Guesthouse room',
    price_per_night: 75,
    currency: 'GEL',
    location: 'Mestia, Upper Svaneti',
    city: 'Mestia',
    latitude: 43.0440,
    longitude: 42.7290,
    host: 'Lasha Khergiani',
    beds: 2,
    baths: 1,
    guests: 3,
    amenities: ['WiFi', 'Mountain view', 'Breakfast included', 'Free parking', 'Heating', 'Fireplace'],
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.91,
    review_count: 67,
    views_count: 512,
    is_published: true,
    is_featured: false,
  },
  {
    title: 'Gudauri Ski-In Ski-Out Alpine Chalet',
    description: 'Steps away from Gondola 1 in Gudauri ski resort. Heated ski gear storage, private sauna, panoramic mountain deck, and fireplace.',
    category: 'cabins',
    type: 'Entire chalet',
    price_per_night: 310,
    currency: 'GEL',
    location: 'Gudauri, Ski Resort',
    city: 'Kazbegi',
    latitude: 42.4770,
    longitude: 44.4750,
    host: 'Elena Rostova',
    beds: 4,
    baths: 2,
    guests: 8,
    amenities: ['Ski-in/Ski-out', 'Sauna', 'WiFi', 'Fireplace', 'Heated floors', 'Free parking', 'Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.89,
    review_count: 42,
    views_count: 680,
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Borjomi Mineral Spring Riverside Retreat',
    description: 'Nestled in the lush coniferous pine forests of Borjomi National Park, right by the fresh river stream. Pure mountain air and natural healing spring water.',
    category: 'villas',
    type: 'Entire villa',
    price_per_night: 160,
    currency: 'GEL',
    location: 'Borjomi, Likani',
    city: 'Borjomi',
    latitude: 41.8380,
    longitude: 43.3880,
    host: 'Tornike Avalishvili',
    beds: 3,
    baths: 2,
    guests: 6,
    amenities: ['WiFi', 'River view', 'Garden', 'BBQ', 'Kitchen', 'Free parking', 'Heating'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.84,
    review_count: 38,
    views_count: 390,
    is_published: true,
    is_featured: false,
  }
];

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'kaya';

console.log('\n=============================================');
console.log('      Kaya.ge — MongoDB Manual Seeder');
console.log('=============================================\n');

if (!uri) {
  console.log('❌ MONGODB_URI is not set in .env.local');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
});

async function seed() {
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    const now = new Date();

    // 1. Seed Users
    console.log('\n1. Seeding default users...');
    const usersCol = db.collection('users');
    const adminHash = await bcrypt.hash('admin123', 12);
    const hostHash = await bcrypt.hash('host123', 12);
    const touristHash = await bcrypt.hash('tourist123', 12);

    const defaultUsers = [
      {
        name: 'Kaya Administrator',
        email: 'admin@kaya.ge',
        password: adminHash,
        role: 'admin',
        affiliateCode: 'KAYAADMIN',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Ahsan Admin',
        email: 'ahsanstarn@gmail.com',
        password: adminHash,
        role: 'admin',
        affiliateCode: 'KAYASTAR',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Dato Host',
        email: 'host@kaya.ge',
        password: hostHash,
        role: 'business',
        affiliateCode: 'HOSTDATO',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Elena Traveler',
        email: 'tourist@kaya.ge',
        password: touristHash,
        role: 'tourist',
        affiliateCode: 'ELENATRAVEL',
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const u of defaultUsers) {
      await usersCol.updateOne(
        { email: u.email },
        { $setOnInsert: u },
        { upsert: true }
      );
    }
    console.log('   ✅ Users ready: admin@kaya.ge, host@kaya.ge, tourist@kaya.ge');

    // 2. Seed Listings
    console.log('\n2. Seeding listings...');
    const listingsCol = db.collection('listings');
    const existingCount = await listingsCol.countDocuments();
    if (existingCount === 0) {
      const formattedListings = SEED_LISTINGS.map(l => ({
        ...l,
        createdAt: now,
        updatedAt: now,
      }));
      await listingsCol.insertMany(formattedListings);
      console.log(`   ✅ Seeded ${formattedListings.length} Georgian listings!`);
    } else {
      console.log(`   ℹ️  Listings collection already has ${existingCount} item(s). Skipping overwrite.`);
    }

    console.log('\n🎉 Seeding complete! Your MongoDB is ready.\n');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await client.close();
  }
}

seed();
