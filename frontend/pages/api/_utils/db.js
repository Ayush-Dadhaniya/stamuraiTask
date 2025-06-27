import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URL;

if (!MONGODB_URI) {
  console.error('❌ MONGO_URL environment variable is not set');
  console.error('Please add MONGO_URL to your .env.local file');
  console.error('Example: MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('MONGO_URL environment variable is not set. Please add it to your .env.local file.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect; 