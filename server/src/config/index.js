const dotenv = require("dotenv");
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  URI: process.env.CONNECTION_STR,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.ACCESS_TOKEN_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};

export default config;
