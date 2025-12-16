
import express from 'express';
import cors from 'cors';

const app = express();
const cookieParser = require("cookie-parser");
app.use(
  cors({
    origin: ["http://localhost:5173", "https://employee-flow-app.web.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Employee Flow Server Is Running");
});
export default app