import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'kaya';

console.log('\n=============================================');
console.log('   Kaya.ge — MongoDB Connection Diagnostics');
console.log('=============================================\n');

if (!uri) {
  console.log('❌ MONGODB_URI is not set in .env.local');
  console.log('\n👉 To connect MongoDB:');
  console.log('1. Open or create .env.local in the root directory.');
  console.log('2. Add your MongoDB connection string:');
  console.log('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/kaya?retryWrites=true&w=majority');
  console.log('   MONGODB_DB_NAME=kaya\n');
  console.log('ℹ️  Currently, Kaya.ge is using the local file database fallback (data/kaya-db.json).\n');
  process.exit(0);
}

console.log(`Connecting to MongoDB...`);
console.log(`Target Database: ${dbName}`);

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
});

async function run() {
  try {
    await client.connect();
    const db = client.db(dbName);
    await db.command({ ping: 1 });
    console.log('\n✅ Successfully connected to MongoDB!');

    const collections = await db.listCollections().toArray();
    console.log(`\nFound ${collections.length} collection(s):`);
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`  - ${col.name}: ${count} document(s)`);
    }

    console.log('\n🚀 MongoDB is fully configured and ready for Kaya.ge!\n');
  } catch (err) {
    console.error('\n❌ MongoDB Connection Error:', err.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check that your IP address is whitelisted in MongoDB Atlas (Network Access -> Add 0.0.0.0/0).');
    console.log('2. Verify your database username and password in MONGODB_URI.');
    console.log('3. Ensure the password does not contain unencoded special characters.\n');
  } finally {
    await client.close();
  }
}

run();
