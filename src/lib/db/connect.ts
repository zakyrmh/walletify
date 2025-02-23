// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Harap definisikan variabel lingkungan MONGODB_URI di dalam .env.local"
  );
}

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Menambahkan properti mongooseCache ke globalThis
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

async function connectToDatabase(): Promise<mongoose.Connection> {
  if (global.mongooseCache?.conn) {
    return global.mongooseCache.conn;
  }

  if (!global.mongooseCache?.promise) {
    global.mongooseCache = {
      conn: null,
      promise: mongoose
        .connect(MONGODB_URI || "", {
          dbName: "walletify",
        })
        .then((mongooseInstance) => {
          console.log("Berhasil terhubung ke MongoDB Atlas");
          return mongooseInstance.connection;
        })
        .catch((error) => {
          console.error("Gagal terhubung ke MongoDB:", error);
          throw error;
        }),
    };
  }

  try {
    global.mongooseCache.conn = await global.mongooseCache.promise;
  } catch (error) {
    global.mongooseCache.promise = null;
    throw error;
  }

  if (!global.mongooseCache.conn) {
    throw new Error("Failed to establish a connection to the database");
  }

  return global.mongooseCache.conn;
}

export default connectToDatabase;
