
import mongoose, { Types } from 'mongoose';


export interface ITrainer {
  _id?: Types.ObjectId;
  id?: string; 
  name: string;
  phone: number;
  email: string;
  password: string;
  dob?: string;
  profileImage?: string;
  gender?: 'male' | 'female' | 'other' | ''; 
  yearsOfExperience?: number;
  language?: string;
  specialization: Types.ObjectId;  
  dailySessionLimit: number 
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
    trainerId: Types.ObjectId;
    specializationId: Types.ObjectId;
    profileImage: string,
    certificate: string
    aadhaarFrontImage: string,
    aadhaarBackImage: string,
    kycStatus: 'pending' | 'approved' | 'rejected';
    rejectionReason: string
    kycSubmissionDate: Date;
    kycComments: string;
  }
  



  export interface ILoginTrainer {
    email: string;
    password: string;
  }

export interface ISession {
  trainerId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  selectedDate: Date;
  startTime: string;
  endTime: string;
  isSingleSession: boolean;
  numberOfSessions: number;
  price: number | undefined
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'InProgress';
}


