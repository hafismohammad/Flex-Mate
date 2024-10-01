import mongoose from "mongoose";

export interface IUser {
   _id?: mongoose.Types.ObjectId;
   name: string;
   email: string;
   phone: number;
   password: string;
   dob?: string;
   image?: string;
   gender?: string;
   address?: {
       street: string; 
       city: string;
   };
   isBlocked: boolean;
};