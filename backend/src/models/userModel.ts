import mongoose, { Schema, model, Document } from "mongoose";

// Define the User interface extending Document
interface User extends Document {
    name: string;
    email: string;
    phone: number;
    password: string;
    dob: string;
    image: string;
    gender: string;
    address: {
        street: string; 
        city: string;
    };
    is_blocked: boolean;
}

// Create the user schema
const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    dob: { type: String, required: true }, 
    image: { type: String, required: false },
    gender: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
    },
    is_blocked: { type: Boolean, default: false },
}, { timestamps: true }); 

// Export the User model
const UserModel = model<User>("User", userSchema);
export default UserModel;
