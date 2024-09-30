import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import connectDB from './src/utils/db';

// Express app initialization 
const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
connectDB()


app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
