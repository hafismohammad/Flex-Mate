import mongoose, { Schema, model, Document } from "mongoose";

// Define the User interface extending Document
interface User extends Document {
    name: string;
    email: string;
    phone: number;
    password: string;
    dob?: string;
    image?: string;
    gender?: string;
    address?: {
        street: string; 
        city: string;
    };
    isBlocked: boolean;
}

// Create the user schema
const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
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
const UserModel = model<User>("User", userSchema);
export default UserModel;
