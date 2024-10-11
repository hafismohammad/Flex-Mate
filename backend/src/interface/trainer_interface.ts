import mongoose from "mongoose";

export interface ITrainer {
    _id?: mongoose.Types.ObjectId;
    id?: string; 
    name: string;
    phone: number;
    email: string;
    password: string;
    dob?: string;
    image?: string;
    gender?: string;
    address?: {
        street: string; 
        city: string;
    };
    specialization: string
    isBlocked?: boolean;
  }


  export interface ILoginTrainer {
    email: string;
    password: string;
  }


