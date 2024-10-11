import  { Schema, model } from "mongoose";
import { ITrainer } from '../interface/trainer_interface'


// Create the user schema
const trainerSchema = new Schema<ITrainer>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    dob: { type: String, required: false }, 
    image: { type: String, required: false },
    gender: { type: String, required: false },
    address: {
        street: { type: String, required: false },
        city: { type: String, required: false },
    },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true }); 

// Export the User model
const TrainerModel = model<ITrainer>("trainer", trainerSchema);
export default TrainerModel;
