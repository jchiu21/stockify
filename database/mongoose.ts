import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

// prevent multiple duplicate mongo connections from nextjs hot reload by using global caching
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if(!MONGODB_URI) throw new Error("MONGODB_URI must be set within .env");

  // already connected
  if(cached.conn) return cached.conn;

  // no cached promise, start the connection
  if(!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false})
  }

  try {
    // wait for connection to complete (first connection) OR 
    // connection already in progress, wait for the same promise (multiple actions)
    cached.conn = await cached.promise;
  } catch(err) {
    cached.promise = null
    throw err;
  }

  console.log(`Connected to database ${process.env.NODE_ENV} - ${MONGODB_URI}`)
}