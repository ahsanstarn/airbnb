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
  },
  {
    title: 'Rooms Hotel Kazbegi Alpine Retreat',
    description: 'Iconic timber and glass mountain retreat facing the majestic peak of Mount Kazbek. Features floor-to-ceiling glass sun terrace, alpine heated pool, and farm-to-table Georgian dining.',
    category: 'hotels',
    type: 'Boutique Hotel',
    price_per_night: 340,
    price_unit: 'night',
    currency: 'GEL',
    location: 'Kazbegi, Stepantsminda',
    city: 'Kazbegi',
    latitude: 42.6590,
    longitude: 44.6430,
    host: 'Rooms Hospitality',
    beds: 2,
    baths: 1,
    guests: 3,
    amenities: ['Indoor pool', 'Sauna', 'Mountain view', 'WiFi', 'Bar & Lounge', 'Terrace', 'Fireplace'],
    images: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.98,
    review_count: 215,
    views_count: 1420,
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Sololaki Heritage High-Ceiling Art Flat',
    description: '19th century historical residence in Old Tbilisi featuring ornate ceiling frescoes, carved cedar balcony, and modern minimalist European interior styling.',
    category: 'apartments',
    type: 'Entire apartment',
    price_per_night: 145,
    price_unit: 'night',
    currency: 'GEL',
    location: 'Tbilisi, Sololaki',
    city: 'Tbilisi',
    latitude: 41.6910,
    longitude: 44.8010,
    host: 'Levan Kipiani',
    beds: 2,
    baths: 1,
    guests: 4,
    amenities: ['WiFi', 'Kitchen', 'Heritage balcony', 'Air conditioning', 'Espresso machine', 'City view'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.94,
    review_count: 88,
    views_count: 720,
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Shatili Stone Fortress Mountain House',
    description: 'Authentic stone fortress living in the ancient mountain stronghold of Khevsureti. Thick schist masonry, hand-woven carpets, river sounds, and pure alpine serenity.',
    category: 'houses',
    type: 'Historic House',
    price_per_night: 150,
    price_unit: 'night',
    currency: 'GEL',
    location: 'Khevsureti, Shatili',
    city: 'Shatili',
    latitude: 42.6580,
    longitude: 45.1580,
    host: 'Beso Chincharauli',
    beds: 3,
    baths: 2,
    guests: 6,
    amenities: ['Mountain view', 'Fireplace', 'Homecooked breakfast', 'Hiking trails', 'River access'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.97,
    review_count: 36,
    views_count: 410,
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Kazbegi Valley Basalt Stone House',
    description: 'Modern architectural masterpiece built with local basalt stone and Douglas fir wood in Sno Valley. Panoramic glass front facing Mount Chaukhi.',
    category: 'houses',
    type: 'Entire House',
    price_per_night: 240,
    price_unit: 'night',
    currency: 'GEL',
    location: 'Kazbegi, Sno Valley',
    city: 'Kazbegi',
    latitude: 42.6050,
    longitude: 44.6380,
    host: 'Luka Kazbegashvili',
    beds: 3,
    baths: 2,
    guests: 6,
    amenities: ['WiFi', 'Kitchen', 'Underfloor heating', 'Terrace', 'Fireplace', 'Free parking'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.93,
    review_count: 51,
    views_count: 590,
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Toyota Land Cruiser Prado 4x4 Expedition',
    description: 'High-clearance 4WD vehicle equipped for Georgia\'s dramatic mountain passes — Tusheti, Kazbegi, Truso Gorge, and Svaneti. Full insurance and GPS included.',
    category: 'cars',
    type: '4x4 Off-Road',
    price_per_night: 180,
    price_unit: 'day',
    currency: 'GEL',
    location: 'Tbilisi & Batumi Delivery',
    city: 'Tbilisi',
    latitude: 41.7151,
    longitude: 44.8271,
    host: 'Kaya 4x4 Fleet',
    beds: 0,
    baths: 0,
    guests: 5,
    amenities: ['4WD / High clearance', 'Roof rack', 'Full insurance', 'GPS navigation', 'Unlimited km in Georgia'],
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.95,
    review_count: 82,
    views_count: 940,
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Mitsubishi Delica 4WD Mountain Van',
    description: 'The undisputed king of Caucasus exploration. High-clearance AWD van with captain seats, panoramic crystal sunroof, and capacity for 7 adventurers plus expedition luggage.',
    category: 'cars',
    type: '4x4 Van',
    price_per_night: 140,
    price_unit: 'day',
    currency: 'GEL',
    location: 'Tbilisi & Kutaisi Delivery',
    city: 'Tbilisi',
    latitude: 41.7151,
    longitude: 44.8271,
    host: 'Guram Rentals',
    beds: 0,
    baths: 0,
    guests: 7,
    amenities: ['4WD / AWD', 'Captain seats', 'Roof carrier', 'AC', 'Automatic transmission', 'Child seats available'],
    images: [
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.88,
    review_count: 64,
    views_count: 780,
    is_published: true,
    is_featured: false,
  },
  {
    title: 'Kakheti 8,000-Vintage Qvevri Wine Trail',
    description: 'Immerse in UNESCO-inscribed natural wine making. Visit 3 historic family cellars, taste 8 Amber wines straight from clay qvevri, and join a traditional 4-hour Supra feast.',
    category: 'tours',
    type: 'Full Day Tour',
    price_per_night: 120,
    price_unit: 'person',
    currency: 'GEL',
    location: 'Kakheti, Telavi & Sighnaghi',
    city: 'Kakheti',
    latitude: 41.6200,
    longitude: 45.9228,
    host: 'Kakheti Wine Masters',
    beds: 0,
    baths: 0,
    guests: 8,
    amenities: ['Wine tastings included', 'Traditional Supra meal', 'Certified sommelier guide', 'Mercedes Sprinter transport'],
    images: [
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.99,
    review_count: 146,
    views_count: 1200,
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Kazbegi Gergeti Glacier 4x4 Alpine Trek',
    description: 'Ascend beyond Gergeti Trinity Church into the high alpine glacier moraine under the volcanic peak of Mount Kazbek (5,054m). Includes off-road transport, alpine picnic, and guide.',
    category: 'tours',
    type: 'Alpine Trek',
    price_per_night: 95,
    price_unit: 'person',
    currency: 'GEL',
    location: 'Stepantsminda, Kazbegi',
    city: 'Kazbegi',
    latitude: 42.6568,
    longitude: 44.6433,
    host: 'Caucasus Mountain Guides',
    beds: 0,
    baths: 0,
    guests: 6,
    amenities: ['4x4 Transport', 'Certified alpine guide', 'Trekking poles provided', 'High-altitude picnic'],
    images: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.96,
    review_count: 98,
    views_count: 890,
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Sakhli Traditional Georgian Supra & Wine Cellar',
    description: 'Authentic 19th-century salon dining in Old Tbilisi. Featuring handmade khinkali, slow-roasted shashlik over vine embers, and private cellar tastings with a Tamada toastmaster.',
    category: 'restaurants',
    type: 'Dining & Wine',
    price_per_night: 55,
    price_unit: 'person',
    currency: 'GEL',
    location: 'Tbilisi, Old Town',
    city: 'Tbilisi',
    latitude: 41.6930,
    longitude: 44.8050,
    host: 'Chef Dato & Family',
    beds: 0,
    baths: 0,
    guests: 10,
    amenities: ['Table reservation', 'Qvevri wine pairings', 'Vegetarian options', 'Polyphonic singing on weekends'],
    images: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.89,
    review_count: 112,
    views_count: 980,
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Royal Chreli-Abano Thermal Sulfur Baths & Hammam',
    description: 'Historic Persian-tiled private bathhouse in Abanotubani fed by natural hot sulfur springs. Includes authentic Mekise foam scrub, massage, and herbal mountain tea service.',
    category: 'salons',
    type: 'Thermal Spa & Bath',
    price_per_night: 120,
    price_unit: 'hour',
    currency: 'GEL',
    location: 'Tbilisi, Abanotubani',
    city: 'Tbilisi',
    latitude: 41.6880,
    longitude: 44.8110,
    host: 'Royal Abanotubani',
    beds: 0,
    baths: 0,
    guests: 6,
    amenities: ['Private thermal pool', 'Mekise scrub included', 'Herbal sauna', 'Towel & robe service', 'Herbal tea'],
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=900&h=700&fit=crop'
    ],
    overall_rating: 4.97,
    review_count: 138,
    views_count: 1140,
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Certified Caucasus High-Mountain Guide & 4x4 Driver',
    description: 'IFMGA-certified mountain guide and safety expert for high-altitude trekking, off-piste ski mountaineering, and custom 4x4 wilderness overland journeys across Georgia.',
    category: 'services',
    type: 'Guide & Driver',
    price_per_night: 160,
    price_unit: 'day',
    currency: 'GEL',
    location: 'All Georgia Regions',
    city: 'Tbilisi',
    latitude: 41.7151,
    longitude: 44.8271,
    host: 'Davit Kvaratskhelia',
    beds: 0,
    baths: 0,
    guests: 4,
    amenities: ['Certified IFMGA Guide', '4x4 Vehicle included', 'First Aid & Satellite comms', 'English / Russian / Georgian fluent'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=700&fit=crop'
    ],
    overall_rating: 5.0,
    review_count: 54,
    views_count: 480,
    is_published: true,
    is_featured: true,
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
    console.log('   ✅ Users ready: admin@kaya.ge, ahsanstarn@gmail.com, host@kaya.ge, tourist@kaya.ge');

    const hostUser = await usersCol.findOne({ email: 'host@kaya.ge' });
    const touristUser = await usersCol.findOne({ email: 'tourist@kaya.ge' });
    const hostId = hostUser ? hostUser._id.toString() : 'host-1';
    const touristId = touristUser ? touristUser._id.toString() : 'tourist-1';

    // 2. Seed Listings across all 11 categories
    console.log('\n2. Seeding listings across all 11 Georgian categories...');
    const listingsCol = db.collection('listings');
    for (const l of SEED_LISTINGS) {
      await listingsCol.updateOne(
        { title: l.title },
        {
          $set: {
            ...l,
            hostId: hostId,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        { upsert: true }
      );
    }
    const totalListings = await listingsCol.countDocuments();
    console.log(`   ✅ Seeded/Upserted Georgian listings! Total listings in MongoDB: ${totalListings}`);

    // 3. Seed Bookings
    console.log('\n3. Seeding sample bookings for dashboard...');
    const bookingsCol = db.collection('bookings');
    const existingBookings = await bookingsCol.countDocuments();
    if (existingBookings === 0) {
      const sampleHotel = await listingsCol.findOne({ category: 'hotels' });
      const sampleCar = await listingsCol.findOne({ category: 'cars' });
      const sampleTour = await listingsCol.findOne({ category: 'tours' });

      const sampleBookings = [
        {
          listing_id: sampleHotel ? sampleHotel._id.toString() : 'seed-1',
          listing_title: sampleHotel ? sampleHotel.title : 'Panoramic Suite with City & Fortress Views',
          listing_category: 'hotels',
          listing_image: sampleHotel && sampleHotel.images ? sampleHotel.images[0] : '',
          user_id: touristId,
          user_name: 'Elena Traveler',
          user_email: 'tourist@kaya.ge',
          host_id: hostId,
          host_name: 'Dato Host',
          check_in: '2026-10-20',
          check_out: '2026-10-23',
          guests: 2,
          total_price: 840,
          currency: 'GEL',
          status: 'confirmed',
          payment_method: 'card',
          payment_status: 'paid',
          notes: 'Early check-in requested at 12:00',
          createdAt: new Date(Date.now() - 86400000 * 2),
          updatedAt: new Date(Date.now() - 86400000 * 2),
        },
        {
          listing_id: sampleCar ? sampleCar._id.toString() : 'seed-12',
          listing_title: sampleCar ? sampleCar.title : 'Toyota Land Cruiser Prado 4x4 Expedition',
          listing_category: 'cars',
          listing_image: sampleCar && sampleCar.images ? sampleCar.images[0] : '',
          user_id: touristId,
          user_name: 'Elena Traveler',
          user_email: 'tourist@kaya.ge',
          host_id: hostId,
          host_name: 'Dato Host',
          check_in: '2026-10-24',
          check_out: '2026-10-27',
          guests: 4,
          total_price: 720,
          currency: 'GEL',
          status: 'confirmed',
          payment_method: 'card',
          payment_status: 'paid',
          notes: 'Pick up at Tbilisi Airport',
          createdAt: new Date(Date.now() - 86400000 * 1),
          updatedAt: new Date(Date.now() - 86400000 * 1),
        },
        {
          listing_id: sampleTour ? sampleTour._id.toString() : 'seed-14',
          listing_title: sampleTour ? sampleTour.title : 'Kakheti 8,000-Vintage Qvevri Wine Trail',
          listing_category: 'tours',
          listing_image: sampleTour && sampleTour.images ? sampleTour.images[0] : '',
          user_id: touristId,
          user_name: 'Elena Traveler',
          user_email: 'tourist@kaya.ge',
          host_id: hostId,
          host_name: 'Dato Host',
          check_in: '2026-10-28',
          check_out: '2026-10-28',
          guests: 2,
          total_price: 240,
          currency: 'GEL',
          status: 'pending',
          payment_method: 'cash',
          payment_status: 'pending',
          notes: 'English speaking guide preferred',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      await bookingsCol.insertMany(sampleBookings);
      console.log(`   ✅ Seeded ${sampleBookings.length} realistic bookings!`);
    } else {
      console.log(`   ℹ️ Bookings collection already has ${existingBookings} records.`);
    }

    console.log('\n🎉 Seeding complete! Your MongoDB is ready.\n');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await client.close();
  }
}

seed();
