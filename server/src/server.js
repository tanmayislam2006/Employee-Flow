import app from "./app";
import config from "./config";

app.listen(() => {
  console.log(`Employee Flow Server Ruining http://localhost:${config.port}`);
});
