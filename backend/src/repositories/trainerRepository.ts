// trainerRepository.js

import { ITrainer } from "../interface/trainer_interface";
import SpecializationModel from "../models/specializationModel";
import TrainerModel from "../models/trainerModel";
import OtpModel from "../models/otpModel";

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
 
}

export default TrainerRepository;
