import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import connectDB from "./utils/db";
import cookieParser from "cookie-parser";
import userRoute from "../src/routes/userRoute";
import AdminRoute from "../src/routes/adminRoute";
import TrainerRoute from "../src/routes/trainerRoute";
import path from "path";

// Express app initialization
const app: Application = express();

// MongoDB connection
connectDB();

app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/user/", userRoute);
app.use("/api/admin/", AdminRoute);
app.use("/api/trainer/", TrainerRoute);

// Server running
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
