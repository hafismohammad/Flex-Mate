

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