import  { Schema, model, Document } from "mongoose";
import { IUser } from '../interface/userTypes'


// Create the user schema
const userSchema = new Schema<IUser>({
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
const UserModel = model<IUser>("User", userSchema);
export default UserModel;
