import { MongoClient, Db } from 'mongodb';
import { getLocalDb } from './local-db';

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.MONGODB_DB_NAME || 'kaya';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // If no MongoDB URI provided or explicit local flag set
  if (!MONGODB_URI || process.env.USE_LOCAL_DB === 'true') {
    return { client: null, db: getLocalDb() as unknown as Db };
  }

  try {
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    await client.connect();
    const db = client.db(DB_NAME);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (err) {
    console.warn('[DB] MongoDB connection timed out or unavailable. Falling back to local database engine.', err);
    return { client: null, db: getLocalDb() as unknown as Db };
  }
}

export async function getDb(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}
