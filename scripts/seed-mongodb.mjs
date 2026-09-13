import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import { SEED_LISTINGS } from '../lib/seed-data.js';

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
