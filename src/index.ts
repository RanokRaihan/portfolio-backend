import app from "./app";
import { port } from "./config";
import { connectDB } from "./db";

connectDB()
  .then(() => {
    app.listen(port || 3000, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Something went wrong. server start faild!", err);
  });
