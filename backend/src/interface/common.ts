import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  id?: string;
  name: string;
  email: string;
  phone: number;
  password: string;
  dob?: string;
  image?: string;
  gender?: string;
  isBlocked: boolean;
}

export interface IOtp {
  _id?: mongoose.Types.ObjectId;
  otp: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IBooking {
    sessionId: mongoose.Types.ObjectId;
    trainerId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId | undefined; 
    specializationId?: mongoose.Types.ObjectId;
    sessionType: string;
    bookingDate: Date;
    startDate: Date;
    endDate: Date; 
    startTime: string;
    endTime: string;
    amount: number | undefined;
    paymentStatus: "Confirmed" | "Cancelled" ;
    createdAt: Date; 
    updatedAt: Date; 
    payment_intent?: string;
  }

  export interface ICategory {
    specializationId:mongoose.Types.ObjectId;
    name: string;
    createdAt: Date;
    isListed: boolean; 
}