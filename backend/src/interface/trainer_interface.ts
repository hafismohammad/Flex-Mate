
import mongoose, { Types } from 'mongoose';


export interface ITrainer {
  _id?: Types.ObjectId;
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
  specialization: Types.ObjectId;  
  kycStatus: 'pending' | 'approved' | 'submitted' | 'rejected';
  isBlocked?: boolean;
}

export interface ISpecialization {
    _id: Types.ObjectId;
    name: string;
}



  // src/interface/kyc_interface.ts

  import { Document } from 'mongoose';

  export interface IKYC extends Document {
    trainerId: string;
    address: {
      street: string;
      city: string;
      state: string;
      pinCode: string;
      country: string;
    };
    kycDocuments: string[];
    kycStatus: 'pending' | 'approved' | 'rejected';
    rejectionReason: string
    kycSubmissionDate: Date;
    kycComments: string;
  }
  



  export interface ILoginTrainer {
    email: string;
    password: string;
  }


