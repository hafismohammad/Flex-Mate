import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    const uri = process.env.MONGO_URI  || ''; 
    try {
        await mongoose.connect('mongodb+srv://hafismhdthaleekara764:U0FYcPWqxx4hSVwb@cluster0.mth2i.mongodb.net/?retryWrites=true&w=majority')
        
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('MongoDB connection error', error)
        process.exit(1);
    }
}


export  default connectDB

