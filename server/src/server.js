import app from "./app.js";
import config from "./config/index.js";
import { connectDB } from "./config/db.js";

const startServer = async () => {
  await connectDB();
  app.listen(config.PORT, () => {
    console.log(`Employee Flow Server Running on http://localhost:${config.PORT}`);
  });
};

startServer();
