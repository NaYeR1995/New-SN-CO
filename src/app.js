import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import UserRouter from "./Routers/UserRouter.js";
import authRoutes from "./Routers/authRoutes.js";
import snippetRouter from "./Routers/snippetRouter.js";
import { authenticate } from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser";
import cron from "node-cron";

dotenv.config();
const app = express();
const allowedOrigins = [
  "https://code-snippets-lac.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5500",
];

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ message: "The App is Running" });
});

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/AuthUser", authRoutes);
app.use("/api/v1/snippet", authenticate, snippetRouter);

cron.schedule("*/7 * * * *", () => {
  console.log("Running CRON job every 7 minutes");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
