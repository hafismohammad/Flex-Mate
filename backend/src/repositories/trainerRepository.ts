// trainerRepository.js

import { ITrainer } from "../interface/trainer_interface";
import {IOtp} from '../interface/common'
import SpecializationModel from "../models/specializationModel";
import TrainerModel from "../models/trainerModel";
import OtpModel from "../models/otpModel";
import mongoose from "mongoose";

class TrainerRepository {
    private specializationModel = SpecializationModel;
    private trainerModel = TrainerModel
    private otpModel = OtpModel

    // Method to find all specializations
    async findAllSpecializations() {
        try {
            return await this.specializationModel.find({});
        } catch (error) {
            console.error('Error fetching specializations:', error);
            throw error; 
        }
    }

    async existsTrainer(email: string): Promise<ITrainer | null>  {
        try {
            return await this.trainerModel.findOne({ email });
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

  async getOtpsByEmail(email: string): Promise<IOtp[]> {
    try {
      return await this.otpModel.find({ email });
    } catch (error) {
      console.error("Error in getOtpsByEmail:", error);
      throw error;
    }
  }
  

  async createNewUser(trainerData: ITrainer): Promise<void> {

    try {
      await this.trainerModel.create(trainerData);
      console.log("Trainer created successfully.");
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

    // Find trainer for login
    async findUser(email: string): Promise<ITrainer | null> {
      try {
        return await this.trainerModel.findOne({ email });
      } catch (error) {
        console.log("Error finding user:", error);
        return null;
      }
    }

 
}

export default TrainerRepository;
