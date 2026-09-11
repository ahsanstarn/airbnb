import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { SEED_LISTINGS } from './seed-data';

const DB_FILE = path.join(process.cwd(), 'data', 'kaya-db.json');

// Helper to generate 24-character hex ID (MongoDB ObjectId compatible)
export function createId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomHex = Math.random().toString(16).substring(2, 18).padStart(16, '0');
  return (timestamp + randomHex).substring(0, 24);
}

interface LocalSchema {
  users: any[];
  listings: any[];
  bookings: any[];
  affiliates: any[];
}

let cachedDb: LocalSchema | null = null;

function loadDb(): LocalSchema {
  if (cachedDb) return cachedDb;

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      cachedDb = JSON.parse(content);
      return cachedDb!;
    } catch (e) {
      console.warn('Could not read local DB file, initializing fresh:', e);
    }
  }

  // Initialize initial seed data
  const now = new Date().toISOString();
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);
  const hostPasswordHash = bcrypt.hashSync('host123', 10);
  const touristPasswordHash = bcrypt.hashSync('tourist123', 10);

  const initialUsers = [
    {
      _id: createId(),
      name: 'Kaya Administrator',
      email: 'admin@kaya.ge',
      password: adminPasswordHash,
      role: 'admin',
      affiliateCode: 'KAYAADMIN',
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: createId(),
      name: 'Ahsan Admin',
      email: 'ahsanstarn@gmail.com',
      password: adminPasswordHash,
      role: 'admin',
      affiliateCode: 'KAYASTAR',
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: createId(),
      name: 'Giorgi Mchedlishvili',
      email: 'host@kaya.ge',
      password: hostPasswordHash,
      role: 'business',
      affiliateCode: 'KAYAHOST',
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: createId(),
      name: 'Nino Bakradze',
      email: 'tourist@kaya.ge',
      password: touristPasswordHash,
      role: 'tourist',
      affiliateCode: 'KAYATOUR',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const hostId = initialUsers[2]._id;

  const initialListings = SEED_LISTINGS.map((l, index) => {
    const id = createId();
    return {
      ...l,
      _id: id,
      id: id,
      businessId: hostId,
      businessName: 'Giorgi Mchedlishvili',
      createdAt: new Date(Date.now() - (index * 86400000)).toISOString(),
      updatedAt: now,
    };
  });

  const initialBookings = [
    {
      _id: createId(),
      listing_id: initialListings[0]._id,
      listing_title: initialListings[0].title,
      listing_image: initialListings[0].images[0],
      listing_location: initialListings[0].location,
      tourist_id: initialUsers[3]._id,
      tourist_name: initialUsers[3].name,
      tourist_email: initialUsers[3].email,
      business_id: hostId,
      check_in: '2026-09-20',
      check_out: '2026-09-24',
      nights: 4,
      guest_count: 2,
      price_per_night: initialListings[0].price_per_night,
      total_price: initialListings[0].price_per_night * 4,
      currency: 'GEL',
      status: 'CONFIRMED',
      payment_method: 'card',
      payment_status: 'PAID',
      createdAt: now,
      updatedAt: now,
    }
  ];

  cachedDb = {
    users: initialUsers,
    listings: initialListings,
    bookings: initialBookings,
    affiliates: [
      {
        _id: createId(),
        referrerUserId: initialUsers[2]._id,
        code: 'KAYAHOST',
        status: 'registered',
        referredUserId: initialUsers[3]._id,
        createdAt: now,
      }
    ],
  };

  saveDb(cachedDb);
  return cachedDb;
}

function saveDb(db: LocalSchema) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local database:', err);
  }
}

// Simple Mongo-like query matcher
function matchFilter(item: any, filter: any): boolean {
  if (!filter || Object.keys(filter).length === 0) return true;

  for (const key of Object.keys(filter)) {
    const condition = filter[key];

    if (key === '$or' && Array.isArray(condition)) {
      const matchesAny = condition.some(subFilter => matchFilter(item, subFilter));
      if (!matchesAny) return false;
      continue;
    }

    if (key === '$and' && Array.isArray(condition)) {
      const matchesAll = condition.every(subFilter => matchFilter(item, subFilter));
      if (!matchesAll) return false;
      continue;
    }

    const itemValue = item[key];

    if (condition && typeof condition === 'object' && !Array.isArray(condition)) {
      if (condition.$regex) {
        const regex = new RegExp(condition.$regex, condition.$options || '');
        if (!regex.test(String(itemValue || ''))) return false;
      }
      if (condition.$gte !== undefined && Number(itemValue) < Number(condition.$gte)) return false;
      if (condition.$lte !== undefined && Number(itemValue) > Number(condition.$lte)) return false;
      if (condition.$nin && Array.isArray(condition.$nin)) {
        if (condition.$nin.includes(itemValue)) return false;
      }
      if (condition.$in && Array.isArray(condition.$in)) {
        if (!condition.$in.includes(itemValue)) return false;
      }
    } else {
      // Direct equality check (supports string vs object ID comparison)
      if (String(itemValue) !== String(condition)) {
        if (key === '_id' && String(item.id) === String(condition)) {
          // Matched via item.id
        } else if (key === 'id' && String(item._id) === String(condition)) {
          // Matched via item._id
        } else {
          return false;
        }
      }
    }
  }

  return true;
}

// Emulates MongoDB Collection
export class LocalCollection {
  private collectionName: keyof LocalSchema;

  constructor(collectionName: keyof LocalSchema) {
    this.collectionName = collectionName;
  }

  private getItems(): any[] {
    const db = loadDb();
    if (!db[this.collectionName]) {
      db[this.collectionName] = [];
    }
    return db[this.collectionName];
  }

  async find(filter: any = {}) {
    const items = this.getItems().filter(item => matchFilter(item, filter));
    let result = [...items];

    const cursor = {
      sort: (sortObj: any) => {
        if (sortObj && typeof sortObj === 'object') {
          const keys = Object.keys(sortObj);
          result.sort((a, b) => {
            for (const key of keys) {
              const dir = sortObj[key] === -1 ? -1 : 1;
              const valA = a[key] ?? 0;
              const valB = b[key] ?? 0;
              if (valA < valB) return -1 * dir;
              if (valA > valB) return 1 * dir;
            }
            return 0;
          });
        }
        return cursor;
      },
      skip: (n: number) => {
        result = result.slice(n);
        return cursor;
      },
      limit: (n: number) => {
        result = result.slice(0, n);
        return cursor;
      },
      toArray: async () => {
        return JSON.parse(JSON.stringify(result));
      },
    };

    return cursor;
  }

  async findOne(filter: any = {}) {
    const items = this.getItems();
    const item = items.find(i => matchFilter(i, filter));
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async insertOne(doc: any) {
    const db = loadDb();
    const id = doc._id || createId();
    const newDoc = {
      ...doc,
      _id: id,
      id: id,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db[this.collectionName].push(newDoc);
    saveDb(db);
    return { insertedId: id, acknowledged: true };
  }

  async insertMany(docs: any[]) {
    const db = loadDb();
    const insertedIds: string[] = [];
    for (const doc of docs) {
      const id = doc._id || createId();
      const newDoc = {
        ...doc,
        _id: id,
        id: id,
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db[this.collectionName].push(newDoc);
      insertedIds.push(id);
    }
    saveDb(db);
    return { insertedIds, acknowledged: true };
  }

  async updateOne(filter: any, update: any) {
    const db = loadDb();
    const items = db[this.collectionName];
    const index = items.findIndex(i => matchFilter(i, filter));

    if (index !== -1) {
      const current = items[index];
      if (update.$set) {
        Object.assign(current, update.$set);
      }
      if (update.$inc) {
        for (const [k, v] of Object.entries(update.$inc)) {
          current[k] = (Number(current[k]) || 0) + Number(v);
        }
      }
      current.updatedAt = new Date().toISOString();
      saveDb(db);
      return { matchedCount: 1, modifiedCount: 1 };
    }

    return { matchedCount: 0, modifiedCount: 0 };
  }

  async deleteOne(filter: any) {
    const db = loadDb();
    const items = db[this.collectionName];
    const index = items.findIndex(i => matchFilter(i, filter));
    if (index !== -1) {
      items.splice(index, 1);
      saveDb(db);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async countDocuments(filter: any = {}) {
    return this.getItems().filter(item => matchFilter(item, filter)).length;
  }
}

export class LocalDb {
  collection(name: string) {
    return new LocalCollection(name as keyof LocalSchema);
  }
}

export function getLocalDb() {
  return new LocalDb();
}
