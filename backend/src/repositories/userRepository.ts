import { IUser, IOtp } from "../interface/common";
import UserModel from "../models/userModel";
import OtpModel from "../models/otpModel";
import mongoose from "mongoose";
import TrainerModel from "../models/trainerModel";
import SpecializationModel from "../models/specializationModel";

class UserRepository {
  private userModel = UserModel;
  private otpModel = OtpModel;
  private trainerModel = TrainerModel
  private specializationModel = SpecializationModel

  // Check if user already exists by email
  async existsUser(email: string): Promise<IUser | null> {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  // Save OTP to the OTP collection with expiration time
  async saveOTP(email: string, OTP: string, OTPExpiry: Date): Promise<void> {
    try {
      const newOtp = new this.otpModel({
        email,
        otp: OTP,
        expiresAt: OTPExpiry,
      });

      await newOtp.save();
    } catch (error) {
      console.error("Error in saveOTP:", error);
      throw error;
    }
  }

  // Fetch OTPs by email
  async getOtpsByEmail(email: string): Promise<IOtp[]> {
    try {
      return await this.otpModel.find({ email });
    } catch (error) {
      console.error("Error in getOtpsByEmail:", error);
      throw error;
    }
  }

  // Create new user
  async createNewUser(userData: IUser): Promise<void> {
    console.log("create new user", userData);

    try {
      await this.userModel.create(userData);
      console.log("User created successfully.");
    } catch (error) {
      console.error("Error in creating User:", error);
      throw error;
    }
  }

  // Delete OTP by ID
  async deleteOtpById(otpId?: mongoose.Types.ObjectId): Promise<void> {
    try {
      if (!otpId) {
        throw new Error("OTP ID is undefined");
      }

      // Find OTP by ID and delete
      await this.otpModel.findByIdAndDelete(otpId.toString());
      console.log(`OTP with ID ${otpId} deleted successfully.`);
    } catch (error) {
      console.error("Error in deleting OTP:", error);
      throw error;
    }
  }

  // Find user for login
  async findUser(email: string): Promise<IUser | null> {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      console.log("Error finding user:", error);
      return null;
    }
  }

  async fetchAllTrainers() {
    try {
      const trainers = await this.trainerModel.find({}).populate('specialization')
      // const trainers1 = await this.specializationModel({})
      console.log('Trainers with specializations:', trainers); 
      return trainers; 
    } catch (error) {
      console.error('Error fetching trainers from the database:', error);
      throw error; 
    }
  }
  

  
  

  async fetchSpecializations() {
    try {
      const data =   await this.specializationModel.find({})
      return data
    } catch (error) {
      console.error('Error fetching specializations from the database:', error);
      throw error; 
    }
  }
}

export default UserRepository;
