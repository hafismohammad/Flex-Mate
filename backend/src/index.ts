import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import connectDB from './utils/db';
import cookieParser from 'cookie-parser';
import userRoute from '../src/routes/userRoute'
import AdminRoute from '../src/routes/adminRoute'
// Express app initialization
const app: Application = express();

// MongoDB connection
connectDB();

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

// Test route
// app.get('/', (req: Request, res: Response) => {
//   res.send('Welcome to the Home Page');
// });

app.use('/user/api', userRoute); 
app.use('/admin/api', AdminRoute); 


// Server running
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
