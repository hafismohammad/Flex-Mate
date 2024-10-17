import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import connectDB from './utils/db';
import cookieParser from 'cookie-parser';
import userRoute from '../src/routes/userRoute'
import AdminRoute from '../src/routes/adminRoute'
import TrainerRoute from '../src/routes/trainerRoute'
import path from 'path';
import dotenv from 'dotenv'
import {S3Client} from '@aws-sdk/client-s3'

dotenv.config()

// Express app initialization
const app: Application = express();

// MongoDB connection
connectDB();

const bucketName = process.env.BUCKET_NAME as string
const bucketRegion = process.env.BUCKET_REGION as string
const accessKey = process.env.ACCESS_KEY as string
const secretAccessKey = process.env.SECRET_ACCESS_KEY as string

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 200,
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user/', userRoute); 
app.use('/api/admin/', AdminRoute); 
app.use('/api/trainer/', TrainerRoute)


// Server running
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
