import app from "./src/app.js";
import Config from "./src/config/env.config.js";
import connectDB from "./src/db/db.js";

app.listen(Config.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${Config.PORT}`);
});
