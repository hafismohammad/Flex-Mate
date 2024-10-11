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
  // src/interface/kyc_interface.ts

  export interface IKYC {
    trainerId: string; 
    kycDocuments: string[]; 
    address?: {
        street: string; 
        city: string;
        state: string;
        pinCode: string;
        country: string;
    };
    kycStatus: 'pending' | 'approved' | 'rejected'; 
    kycSubmissionDate?: Date; 
    kycComments?: string;
}



  export interface ILoginTrainer {
    email: string;
    password: string;
  }


