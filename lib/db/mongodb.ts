import { MongoClient, Db, Collection } from 'mongodb';
import { Contribution, Tier } from '../types/contribution';

const uri = process.env.MONGODB_URI ?? '';
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) throw new Error('MONGODB_URI is not set');
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }
  if (!clientPromise) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export default { then: (...args: Parameters<Promise<MongoClient>['then']>) => getClientPromise().then(...args) } as Promise<MongoClient>;

export async function getDatabase(): Promise<Db> {
  const c = await getClientPromise();
  return c.db('yieldr');
}

export async function getContributionsCollection(): Promise<Collection<Contribution>> {
  const db = await getDatabase();
  return db.collection<Contribution>('contributions');
}

export async function getTiersCollection(): Promise<Collection<Tier>> {
  const db = await getDatabase();
  return db.collection<Tier>('tiers');
}

export async function initializeDatabase() {
  try {
    const tiersCollection = await getTiersCollection();
    const count = await tiersCollection.countDocuments();
    if (count === 0) {
      const { TIER_CONFIG } = await import('../types/contribution');
      const tiers = Object.values(TIER_CONFIG);
      await tiersCollection.insertMany(tiers);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
