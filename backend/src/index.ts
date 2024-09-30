import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import connectDB from './utils/db';
import cookieParser from 'cookie-parser'
import userRoute from './routes/userRoute'

// Express app initialization 
const app: Application = express();

// MongoDB connection
connectDB()
app.use(cookieParser());
const corsOptions = {
    origin: "http://localhost:5173",  
    methods: "GET,POST,PUT",  
    allowedHeaders: "Content-Type,Authorization", 
    optionsSuccessStatus: 200,  
    credentials: true,  
  };

// Middlewares 
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));  
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Home Page');
  });

app.use("/api/user", userRoute);



app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
})
