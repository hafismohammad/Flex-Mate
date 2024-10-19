import { Schema, model } from "mongoose";
import { IKYC } from '../interface/trainer_interface';

// Create the KYC schema
const kycSchema = new Schema<IKYC>({
    trainerId: { type: Schema.Types.ObjectId, ref: 'Trainer', required: false },
    specialization: { type: Schema.Types.ObjectId, ref: 'Specialization', required: false },
    address: {
        street: { type: String, required: false }, 
        city: { type: String, required: false },  
        state: { type: String, required: false },  
        pinCode: { type: String, required: false }, 
        country: { type: String, required: false }, 
    },
    kycDocuments: { type: [String], required: true },
    kycStatus: { type: String, enum: ['pending', 'approved', 'submitted', 'rejected'], default: 'pending' },
    kycSubmissionDate: { type: Date, default: Date.now },
    kycComments: { type: String, required: false },
}, { timestamps: true });

const KYCModel = model<IKYC>("KYC", kycSchema);
export default KYCModel;
