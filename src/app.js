import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import UserRouter from "./Routers/UserRouter.js";
import authRoutes from "./Routers/authRoutes.js";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

dotenv.config();
const app = express();
const allowedOrigins = ["https://your-react-app.vercel.app"];

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ message: "The App is Running" });
});

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/AuthUser", authRoutes);

// const port = process.env.PORT || 4000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


export default serverless(app);
