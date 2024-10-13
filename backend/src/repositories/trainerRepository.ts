// trainerRepository.js

import { ITrainer } from "../interface/trainer_interface";
import {IOtp} from '../interface/common'
import SpecializationModel from "../models/specializationModel";
import TrainerModel from "../models/trainerModel";
import OtpModel from "../models/otpModel";
import KYCModel from "../models/KYC_Model";
import mongoose from "mongoose";

class TrainerRepository {
    private specializationModel = SpecializationModel;
    private trainerModel = TrainerModel
    private otpModel = OtpModel
    private kycModel = KYCModel

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
  

  async createNewTrainer(trainerData: ITrainer): Promise<void> {

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
    async findTrainer(email: string): Promise<ITrainer | null> {
      try {
        return await this.trainerModel.findOne({ email });
      } catch (error) {
        console.log("Error finding user:", error);
        return null;
      }
    }

    async saveKyc(formData: any, documents: any) {
      try {
          // Create a new KYC document to save in the database
          const kycData = {
              trainerId: formData.trainer_id,
              address: formData.address,
              pinCode: formData.pinCode,
              kycDocuments: documents, // document filenames
              kycComments: formData.comment,
              kycStatus: 'pending',
              kycSubmissionDate: new Date(),
          };
  
          const savedKyc = await KYCModel.create(kycData);
          return savedKyc;
      } catch (error) {
          console.error('Error in saveKyc repository:', error);
          throw new Error('Failed to save KYC data');
      }
  }
  
 
}

export default TrainerRepository;
