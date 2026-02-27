import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("GreenCare API Running");
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});