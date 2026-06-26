import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import helmet from "helmet";
import { globalErrorHandler } from "./errors/globalErrorHandler";
import notFound from "./middleware/notFound";
import router from "./routes";
// Configuring dotenv to load environment variables from .env file
dotenv.config();
// Create Express server
const app: Application = express();

// Security headers
app.use(helmet());

// Express configuration
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://portfolio-dashboard-blue.vercel.app",
      "https://ranokraihan.com",
      "https://www.ranokraihan.com",
      "https://dashboard.ranokraihan.com",
    ],
    credentials: true,
  })
);

// all routes
app.use("/api/v1", router);
//test route
app.get("/", (req, res) => {
  res.send("hurray! server is up and running!! Majje Karo!!");
});

//global error handler
app.use(globalErrorHandler);

// not found route
app.use(notFound);

// export app
export default app;
