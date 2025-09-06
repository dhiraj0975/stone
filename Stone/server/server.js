import app from "./src/app.js";
import Config from "./src/config/env.config.js";
import connectDB from "./src/db/db.js";

const PORT = Config.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
