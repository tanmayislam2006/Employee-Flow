import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  // Use DB_USER/DB_PASSWORD if CONNECTION_STR is not available, matching index.js logic
  // However, index.js constructed the URI. Let's try to construct it if URI is missing,
  // or expect CONNECTION_STR to be set in .env.
  // Given index.js logic: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xozk3nx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  // I will construct it here if CONNECTION_STR is not set.
  URI: process.env.CONNECTION_STR || `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xozk3nx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.ACCESS_TOKEN_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};

export default config;
