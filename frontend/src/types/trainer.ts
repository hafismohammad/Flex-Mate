

export interface KycDocument {
    type: string;
    file: File | null; 
  }
  
  export interface KycSubmission {
    pinCode: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
    };
    comment: string;
    documents: KycDocument[]; 
  }
  

   export interface ITrainerKycData {
    trainer_id: string;
    specialization: string;
    name: string;
    email: string;
    phone: string;
    profileImage: File | null;
    aadhaarFrontSide: File | null;
    aadhaarBackSide: File | null;
    certificate: File | null;
  }


  export interface Specialization {
    _id: string;
    name: string;
    description: string;
  }
  
  export interface Trainer {
    _id: string;
    name: string;
    email: string;
    phone: number;
    profileImage: string;
    specialization: Specialization;
    imageUrl?: string;
    isBlocked: boolean;
    kycStatus: string;
  }

  export interface TrainerProfile {
    _id: string;
    name: string;
    email: string;
    phone: number;
    profileImage: string;
    specialization: Specialization;
    imageUrl?: string;
    yearsOfExperience?: string | null
    language?: string | null
    gender?: string | null
    isBlocked: boolean;
    kycStatus: string;
  }
  

  export interface ISessionSchedule {
    _id: string;
    isSingleSession: boolean;
    startDate: string; 
    endDate: string; 
    startTime: string;
    endTime: string;
    price: number;
    duration?: string; 
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'InProgress'; 
    trainerId: string;
  }
  