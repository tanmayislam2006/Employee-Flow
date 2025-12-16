import { MongoClient, ServerApiVersion } from "mongodb";
import config from "./index.js";

const uri = config.URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db("Employee-Flow");
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};

export const getCollection = (collectionName) => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db.collection(collectionName);
};
