import app from "./app";
import { config } from "./config";
import { connectDB } from "./db";

connectDB()
  .then(() => {
    app.listen(config.port || 3000, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.log("Something went wrong. server start faild!", err);
  });
