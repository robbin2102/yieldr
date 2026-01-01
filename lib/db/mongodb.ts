// MongoDB connection utility
import { MongoClient, Db, Collection } from 'mongodb';
import { Contribution, Tier } from '../types/contribution';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Database helper functions
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('yieldr');
}

export async function getContributionsCollection(): Promise<Collection<Contribution>> {
  const db = await getDatabase();
  return db.collection<Contribution>('contributions');
}

export async function getTiersCollection(): Promise<Collection<Tier>> {
  const db = await getDatabase();
  return db.collection<Tier>('tiers');
}

// Initialize database with tier data
export async function initializeDatabase() {
  try {
    const tiersCollection = await getTiersCollection();
    const count = await tiersCollection.countDocuments();

    if (count === 0) {
      const { TIER_CONFIG } = await import('../types/contribution');
      const tiers = Object.values(TIER_CONFIG);
      await tiersCollection.insertMany(tiers);
      console.log('✅ Database initialized with tier data');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
