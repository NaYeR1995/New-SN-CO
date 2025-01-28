import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Router from "./Routers/UserRouter.js";
import authRoutes from "./Routers/authRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "The App is Running" });
});

app.use("/api", Router);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
