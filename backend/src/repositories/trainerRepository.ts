// trainerRepository.js

import { ISession, ITrainer } from "../interface/trainer_interface";
import { IOtp } from "../interface/common";
import SpecializationModel from "../models/specializationModel";
import TrainerModel from "../models/trainerModel";
import OtpModel from "../models/otpModel";
import KYCModel from "../models/KYC_Model";
import KycRejectionReasonModel from "../models/kycRejectionReason";
import { ISpecialization } from "../interface/trainer_interface";
import SessionModel from "../models/sessionModel";
import mongoose, { Types } from "mongoose";
import moment from "moment";
import BookingModel from "../models/booking";

class TrainerRepository {
  private specializationModel = SpecializationModel;
  private trainerModel = TrainerModel;
  private otpModel = OtpModel;
  private kycModel = KYCModel;
  private kycRejectionModel = KycRejectionReasonModel;
  private sessionModel = SessionModel;
  private bookingModel = BookingModel

  // Method to find all specializations
  async findAllSpecializations() {
    try {
      return await this.specializationModel.find({});
    } catch (error) {
      console.error("Error fetching specializations:", error);
      throw error;
    }
  }

  async existsTrainer(email: string): Promise<ITrainer | null> {
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

  async findTrainerSpecialization(
    specialization: Types.ObjectId
  ): Promise<ISpecialization | null> {
    try {
      return await this.specializationModel.findOne({ name: specialization });
    } catch (error) {
      console.log("Error in finding trainer specialization:", error);
      return null;
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
      console.log("repository ", email);

      return await this.trainerModel.findOne({ email });
    } catch (error) {
      console.log("Error finding user:", error);
      return null;
    }
  }

  async saveKyc(formData: any, documents: any): Promise<any> {
    try {
      // console.log("KYC Data to save:", { ...formData, ...documents });

      const kycData = {
        trainerId: formData.trainer_id,
        specializationId: formData.specialization,
        profileImage: documents.profileImageUrl,
        aadhaarFrontImage: documents.aadhaarFrontSideUrl,
        aadhaarBackImage: documents.aadhaarBackSideUrl,
        certificate: documents.certificateUrl,
        kycStatus: "pending",
        kycSubmissionDate: new Date(),
      };

      const savedKyc = await this.kycModel.create(kycData);
      console.log("KYC Data saved successfully:", savedKyc);
      return savedKyc;
    } catch (error) {
      console.error("Error in saveKyc repository:", error);
      throw new Error("Failed to save KYC data");
    }
  }

  async getTrainerStatus(trainerId: string) {
    try {
      const trainer = await this.trainerModel
        .findById(trainerId)
        .select("kycStatus");
      if (!trainer) {
        throw new Error(`Trainer with ID ${trainerId} not found`);
      }

      return trainer.kycStatus;
    } catch (error) {
      console.error("Error fetching trainer KYC status:", error);
      throw new Error("Failed to fetch trainer KYC status");
    }
  }

  async changeKycStatus(trainerId: string, profileImage: string) {
    try {
      const trainer = await this.trainerModel.findByIdAndUpdate(
        trainerId,
        {
          kycStatus: "submitted",
          profileImage: profileImage,
        },
        { new: true, runValidators: true }
      );

      await this.kycModel.findByIdAndUpdate(
        trainerId,
        { kycStatus: "submitted" },
        { new: true, runValidators: true }
      );

      return trainer?.kycStatus;
    } catch (error) {
      console.error("Error changing trainer KYC status:", error);
      throw new Error("Failed to change trainer KYC status");
    }
  }

  async updateKycStatus(trainerId: string) {
    try {
      const updatedTrainer = await this.trainerModel.findByIdAndUpdate(
        trainerId,
        { $unset: { kycStatus: "" } },
        { new: true }
      );

      if (updatedTrainer) {
        console.log("KYC status field removed successfully:", updatedTrainer);
      } else {
        console.log("Trainer not found with the given ID:", trainerId);
      }
    } catch (error) {
      console.error("Error removing KYC status field:", error);
    }
  }

  async fetchTrainer(trainer_id: string) {
    try {
      return this.trainerModel
        .findOne({ _id: trainer_id })
        .populate("specialization");
    } catch (error: any) {
      throw Error(error);
    }
  }

  // Repository Method
  async updateTrainerData(trainer_id: string) {
    try {
      const existingTrainer = await this.trainerModel.findById(trainer_id);
      if (!existingTrainer) {
        throw new Error("Trainer not found");
      }
      return existingTrainer;
    } catch (error) {
      console.error("Error in repository layer:", error);
      throw new Error("Failed to update trainer data");
    }
  }

  async fetchRejectionData(trainerId: string) {
    try {
      const rejectionData = await this.kycRejectionModel.findOne({
        trainerId: trainerId,
      });
      console.log("rejectionData:", rejectionData);

      return rejectionData;
    } catch (error) {
      console.error("Error fetching rejection data:", error);
      throw error;
    }
  }

  async createNewSession(sessionData: ISession) {
    try {
      const trainer = await this.trainerModel.findById(sessionData.trainerId);
      if (!trainer) {
        throw new Error("Trainer not found.");
      }
      const dailySessionLimit = trainer.dailySessionLimit;
  
      const allSessions = await this.sessionModel.find({
        trainerId: sessionData.trainerId,
      });
  
      if (allSessions.length >= dailySessionLimit) {
        throw new Error(`Daily session limit of ${dailySessionLimit} reached.`);
      }
  
      const existingSessions = await this.sessionModel.find({
        trainerId: sessionData.trainerId,
        startDate: {
          $gte: sessionData.startDate,
          $lte: sessionData.endDate,
        },
      });
  
      const hasConflict = existingSessions.some((existingSession) => {
        const existingStartDate = moment(existingSession.startDate);
        const existingEndDate = moment(existingSession.endDate);
        const existingStartTime = moment(existingSession.startTime, "HH:mm");
        const existingEndTime = moment(existingSession.endTime, "HH:mm");
      
        const newStartDate = moment(sessionData.startDate);
        const newEndDate = moment(sessionData.endDate);
        const newStartTime = moment(sessionData.startTime, "HH:mm");
        const newEndTime = moment(sessionData.endTime, "HH:mm");
      
        const dateRangeOverlaps = 
          (newStartDate.isSameOrBefore(existingEndDate) && newEndDate.isSameOrAfter(existingStartDate));
      
        const timeRangeOverlaps = 
          newStartTime.isBefore(existingEndTime) && newEndTime.isAfter(existingStartTime);

        return dateRangeOverlaps && timeRangeOverlaps;
      });
      
      if (hasConflict) {
        throw new Error("Time conflict with an existing session.");
      }
      
      
  
      sessionData.price = Number(sessionData.price);
  
      const createdSessionData = await this.sessionModel.create(sessionData);
  
      return createdSessionData;
    } catch (error: any) {
      console.error("Detailed error:", error);
      throw error;
    }
  }
  
  

  async fetchSessionData(trainer_id: string) {
    try {
      const sesseionData = await this.sessionModel.find({
        trainerId: trainer_id,
      });
      // console.log(sesseionData);
      return sesseionData;
    } catch (error) {
      throw error
    }
  }

  async deleteSession(session_id: string) {
   try {
    const deletedSchedule =  await this.sessionModel.findByIdAndDelete(session_id)
    return deletedSchedule
   } catch (error) {
    throw error
   }
  }

  async fetchBookingDetails(trainer_id: string) {
    try {
      const bookingDetails = await this.bookingModel.aggregate([
        { $match: { trainerId: new mongoose.Types.ObjectId(trainer_id) } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $lookup: {
            from: 'trainers',
            localField: 'trainerId',
            foreignField: '_id',
            as: 'trainerDetails',
          },
        },
        {
          $lookup: {
            from: 'sessions',
            localField: 'sessionId',
            foreignField: '_id',
            as: 'sessionDetails',
          },
        },
        { $unwind: "$userDetails" },
        { $unwind: "$trainerDetails" },
        { $unwind: "$sessionDetails" },
        {
          $project: {
            bookingId: "$_id",
            userName: "$userDetails.name",
            trainerName: "$trainerDetails.name",
            sessionDate: "$sessionDetails.startDate",
            sessionType: "$sessionType",
            sessionStartTime: "$startTime",
            sessionEndTime: "$endTime",
            bookingDate: "$bookingDate",
            sessionDates: {
              $cond: {
                if: "$sessionDetails.isSingleSession",
                then: { startDate: "$sessionDetails.startDate" },
                else: {
                  startDate: "$sessionDetails.startDate",
                  endDate: "$sessionDetails.endDate"
                }
              },
            },
            amount: "$amount",
            paymentStatus: "$paymentStatus",
          }
        }
      ]);
  
      console.log('bookingDetails', bookingDetails);
  
      return bookingDetails;
    } catch (error) {
      throw error;
    }
  }
  
  static async getIsBlockedTrainer(trainer_id: string): Promise<boolean> {
    try {
       const trainer = await TrainerModel.findById(trainer_id);
       return  trainer?.isBlocked ?? false;

    } catch (error: any) {
      throw new Error(`Failed to fetch trainer's blocked status: ${error.message}`);
    }
  }
}

export default TrainerRepository;
