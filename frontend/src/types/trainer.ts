

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
  