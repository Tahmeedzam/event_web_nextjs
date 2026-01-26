import mongoose, { Connection, Mongoose } from 'mongoose';

// Type definition for the cached connection object
interface CachedConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Declare global type to store the cached connection in Node.js global scope
declare global {
  var mongooseCache: CachedConnection | undefined;
}

// Initialize or retrieve the cached connection from global scope
const cached: CachedConnection = global.mongooseCache || {
  conn: null,
  promise: null,
};

// Store the cached connection in global scope for reuse across hot reloads
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connects to MongoDB using Mongoose with connection caching.
 * Prevents multiple connections during development hot reloads.
 *
 * @returns Promise<Mongoose> - The Mongoose instance
 * @throws Error if MONGODB_URI environment variable is not set
 */
async function connectDB(): Promise<Mongoose> {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // Return pending promise if connection is in progress
  if (cached.promise) {
    return cached.promise;
  }

  // Get MongoDB URI from environment variables
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error(
      'MONGODB_URI environment variable is not defined. Please set it in your .env.local file.'
    );
  }

  // Create a new promise for the connection
  const promise = mongoose
    .connect(mongodbUri, {
      bufferCommands: false,
    })
    .then((mongooseInstance) => {
      return mongooseInstance;
    });

  // Cache the promise to prevent multiple simultaneous connection attempts
  cached.promise = promise;

  try {
    // Await the connection and cache the result
    cached.conn = await promise;
    return cached.conn;
  } catch (error) {
    // Clear the cached promise if connection fails
    cached.promise = null;
    throw error;
  }
}

export default connectDB;
