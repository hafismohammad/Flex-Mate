import { Schema, model } from "mongoose";
import { IKYC } from '../interface/trainer_interface';

// Create the KYC schema
const kycSchema = new Schema<IKYC>({
    trainerId: { type: Schema.Types.ObjectId, ref: 'trainer', required: true } as any, 
    address: {
        street: { type: String, required: false }, 
        city: { type: String, required: false },  
        state: { type: String, required: false },  
        pinCode: { type: String, required: false }, 
        country: { type: String, required: false }, 
      },
    kycDocuments: { type: [String], required: true },
    kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    kycSubmissionDate: { type: Date, default: Date.now },
    kycComments: { type: String, required: false },
}, { timestamps: true });

const KYCModel = model<IKYC>("KYC", kycSchema);
export default KYCModel;
