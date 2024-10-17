import { Schema, model, Types } from 'mongoose';
import { ITrainer } from '../interface/trainer_interface';

const trainerSchema = new Schema<ITrainer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
 specialization: { type: Schema.Types.ObjectId, ref: 'Specialization' },
  dob: { type: String, required: false },
  image: { type: String, required: false },
  gender: { type: String, required: false },
  address: {
    street: { type: String, required: false },
    city: { type: String, required: false },
  },
  kycStatus: { type: String, enum: ['pending', 'approved', 'submitted', 'reject'], default: 'pending' },
  isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

const TrainerModel = model<ITrainer>('Trainer', trainerSchema);  
export default TrainerModel;
