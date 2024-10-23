
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
  gender?: 'male' | 'female' | 'other' | ''; // Updated gender field with specific options
  yearsOfExperience?: number; // Added yearsOfExperience field
  language?: string; // Added language field
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


