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
import UserModel from "../models/userModel";
import WalletModel, { ITransaction } from "../models/walletModel";

class TrainerRepository {
  private specializationModel = SpecializationModel;
  private trainerModel = TrainerModel;
  private otpModel = OtpModel;
  private kycModel = KYCModel;
  private kycRejectionModel = KycRejectionReasonModel;
  private sessionModel = SessionModel;
  private bookingModel = BookingModel;
  private walletModel = WalletModel;

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

  async findTrainerSpecializations(
    specializationNames: any
  ): Promise<Types.ObjectId[]> {
    try {
      // console.log('specialization names in repo', specializationNames);

      // Find all specializations by name and return their ObjectIds
      const specializations = await this.specializationModel.find({
        name: { $in: specializationNames },
      });

      // If no specializations found, return an empty array
      return specializations.map((spec) => spec._id);
    } catch (error) {
      console.log("Error in finding trainer specializations:", error);
      return [];
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

  async getOldImages(trainerId: string): Promise<any> {
    try {
      
      // Query KYC data using the trainerId field
      const kycData = await this.kycModel.findOne({trainerId: trainerId });
      return kycData;
    } catch (error) {
      console.error("Error fetching old KYC images:", error);
      throw new Error("Failed to fetch old KYC images");
    }
  }
  

  async saveKyc(formData: any, documents: any): Promise<any> {
    try {
      // Convert each specialization ID to an ObjectId instance
      const specializationIds = Array.isArray(formData.specialization)
        ? formData.specialization.map((id: string) => new Types.ObjectId(id))
        : [new Types.ObjectId(formData.specialization)];

      const kycData = {
        trainerId: new Types.ObjectId(formData.trainer_id),
        specializationId: specializationIds,
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


  

  async changeKycStatus(trainerId: string, profileImage: string | undefined): Promise<string | undefined> {
    try {
      // Update the trainer's profile image and KYC status
      const trainerUpdate = await this.trainerModel.findByIdAndUpdate(
        trainerId,
        {
          kycStatus: "submitted",
          profileImage: profileImage,
        },
        { new: true, runValidators: true }
      );
  
      if (!trainerUpdate) {
        throw new Error("Trainer not found");
      }
  
      // Update the corresponding KYC record
      await this.kycModel.findOneAndUpdate(
        { trainerId: trainerId },
        { kycStatus: "submitted" },
        { new: true, runValidators: true }
      );
  
      return trainerUpdate.kycStatus;
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
        console.log("KYC status field removed successfully:");
      } else {
        console.log("Trainer not found with the given ID:", trainerId);
      }
    } catch (error) {
      console.error("Error removing KYC status field:", error);
    }
  }

  async fetchTrainer(trainer_id: string) {
    try {
      const trainerData = await this.trainerModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(trainer_id) },
        },
        {
          $lookup: {
            from: "specializations",
            localField: "specializations",
            foreignField: "_id",
            as: "specializationDetails",
          },
        },
      ]);

      // console.log('trainerData', trainerData);
      return trainerData;
    } catch (error: any) {
      throw new Error(error);
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

  async fetchSpec(traienr_id: string) {
    try {
      const specializations = await this.trainerModel
        .findById({ _id: traienr_id })
        .populate("specializations");
      // console.log('specializations', specializations);
      return specializations?.specializations;
    } catch (error) {}
  }

  async fetchRejectionData(trainerId: string) {
    try {
      const rejectionData = await this.kycRejectionModel.findOne({
        trainerId: trainerId,
      });
      // console.log("rejectionData:", rejectionData);

      return rejectionData;
    } catch (error) {
      console.error("Error fetching rejection data:", error);
      throw error;
    }
  }

  async createMultipleSessions(sessions: ISession[]) {
    try {
      // Ensure all sessions pass validation checks before inserting
      for (const session of sessions) {
        // Validate each session (like checking time conflicts)
        const allSessions = await this.sessionModel.find({
          trainerId: session.trainerId,
        });

        // Check for time conflicts with each session
        const hasConflict = allSessions.some((existingSession) => {
          const existingStartDate = moment(existingSession.startDate);
          const existingEndDate = existingSession.endDate
            ? moment(existingSession.endDate)
            : existingStartDate;

          const existingStartTime = moment(existingSession.startTime, "HH:mm");
          const existingEndTime = moment(existingSession.endTime, "HH:mm");

          const newStartDate = moment(session.startDate);
          const newEndDate = session.endDate
            ? moment(session.endDate)
            : newStartDate;

          const newStartTime = moment(session.startTime, "HH:mm");
          const newEndTime = moment(session.endTime, "HH:mm");

          const dateRangeOverlaps =
            newStartDate.isSameOrBefore(existingEndDate) &&
            newEndDate.isSameOrAfter(existingStartDate);
          const timeRangeOverlaps =
            newStartTime.isBefore(existingEndTime) &&
            newEndTime.isAfter(existingStartTime);

          return dateRangeOverlaps && timeRangeOverlaps;
        });

        if (hasConflict)
          throw new Error(
            `Time conflict detected for session on ${session.startDate}`
          );

        // Validate price as a number
        session.price = Number(session.price);
        if (isNaN(session.price)) throw new Error("Invalid session price.");
      }

      // Insert sessions in batch and retrieve the inserted documents
      const createdSessions = await this.sessionModel.insertMany(sessions, {
        ordered: true,
      });
      return createdSessions;
    } catch (error) {
      console.error("Error creating multiple sessions:", error);
      throw error;
    }
  }

  async createNewSession(sessionData: ISession) {
    try {
      const trainer = await this.trainerModel.findById(sessionData.trainerId);
      if (!trainer) throw new Error("Trainer not found.");

      // const dailySessionLimit = trainer.dailySessionLimit;

      // const allSessions = await this.sessionModel.find({
      //   trainerId: sessionData.trainerId,
      // });

      // if (allSessions.length >= dailySessionLimit) {
      //   throw new Error(`Daily session limit of ${dailySessionLimit} reached.`);
      // }

      // Check for date and time conflicts
      const existingSessions = await this.sessionModel.find({
        trainerId: sessionData.trainerId,
        $or: [
          {
            startDate: {
              $gte: sessionData.startDate,
              $lte: sessionData.endDate,
            },
          },
          {
            startDate: sessionData.startDate,
            endDate: null,
          },
        ],
      });

      const hasConflict = existingSessions.some((existingSession) => {
        const existingStartDate = moment(existingSession.startDate);
        const existingEndDate = existingSession.endDate
          ? moment(existingSession.endDate)
          : existingStartDate;

        const existingStartTime = moment(existingSession.startTime, "HH:mm");
        const existingEndTime = moment(existingSession.endTime, "HH:mm");

        const newStartDate = moment(sessionData.startDate);
        const newEndDate = sessionData.endDate
          ? moment(sessionData.endDate)
          : newStartDate;

        const newStartTime = moment(sessionData.startTime, "HH:mm");
        const newEndTime = moment(sessionData.endTime, "HH:mm");

        // Check date and time overlap
        const dateRangeOverlaps =
          newStartDate.isSameOrBefore(existingEndDate) &&
          newEndDate.isSameOrAfter(existingStartDate);

        const timeRangeOverlaps =
          newStartTime.isBefore(existingEndTime) &&
          newEndTime.isAfter(existingStartTime);

        return dateRangeOverlaps && timeRangeOverlaps;
      });

      if (hasConflict)
        throw new Error("Time conflict with an existing session.");

      sessionData.price = Number(sessionData.price);

      // Create the session with multiple specializations
      const createdSessionData = (
        await this.sessionModel.create(sessionData)
      ).populate("specializationId");

      return createdSessionData;
    } catch (error) {
      console.error("Detailed error in createNewSession:", error);
      throw error;
    }
  }

  async fetchSessionData(trainer_id: string) {
    try {
      const sesseionData = await this.sessionModel
        .find({
          trainerId: trainer_id,
        })
        .populate("specializationId")
        .sort({ createdAt: -1 });

      return sesseionData;
    } catch (error) {
      throw error;
    }
  }

  async deleteSession(session_id: string) {
    try {
      const deletedSchedule = await this.sessionModel.findByIdAndDelete(
        session_id
      );
      return deletedSchedule;
    } catch (error) {
      throw error;
    }
  }

  async fetchBookingDetails(trainer_id: string) {
    try {
      const bookingDetails = await this.bookingModel.aggregate([
        { $match: { trainerId: new mongoose.Types.ObjectId(trainer_id) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "trainers",
            localField: "trainerId",
            foreignField: "_id",
            as: "trainerDetails",
          },
        },
        {
          $lookup: {
            from: "sessions",
            localField: "sessionId",
            foreignField: "_id",
            as: "sessionDetails",
          },
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true, // Preserve if user details are not found
          },
        },
        {
          $unwind: {
            path: "$trainerDetails",
            preserveNullAndEmptyArrays: true, // Preserve if trainer details are not found
          },
        },
        {
          $unwind: {
            path: "$sessionDetails",
            preserveNullAndEmptyArrays: true, // Preserve if session details are not found
          },
        },
        {
          $lookup: {
            from: "specializations",
            localField: "sessionDetails.specializationId", // Assuming this is the field in `sessionDetails`
            foreignField: "_id",
            as: "specializationDetails",
          },
        },
        {
          $unwind: {
            path: "$specializationDetails",
            preserveNullAndEmptyArrays: true, // Preserve if specialization details are not found
          },
        },
        {
          $project: {
            bookingId: "$_id",
            userId: "$userDetails._id",
            userName: "$userDetails.name",
            userImage: "$userDetails.image",
            trainerName: "$trainerDetails.name",
            sessionDate: {
              $ifNull: ["$sessionDetails.startDate", null], // If session is deleted, show as null
            },
            sessionType: "$sessionType",
            sessionStartTime: "$startTime",
            sessionEndTime: "$endTime",
            bookingDate: "$bookingDate",
            sessionDates: {
              $cond: {
                if: { $eq: ["$sessionDetails.isSingleSession", true] },
                then: {
                  startDate: { $ifNull: ["$sessionDetails.startDate", null] },
                },
                else: {
                  startDate: { $ifNull: ["$sessionDetails.startDate", null] },
                  endDate: { $ifNull: ["$sessionDetails.endDate", null] },
                },
              },
            },
            amount: "$amount",
            paymentStatus: "$paymentStatus",
            specialization: {
              id: "$specializationDetails._id",
              name: "$specializationDetails.name",
            },
            sessionStatus: "$sessionDetails.status",
          },
        },
        {
          $sort: {
            bookingDate: -1,
          },
        },
      ]);

      return bookingDetails;
    } catch (error) {
      throw error;
    }
  }

  async fetchUeserDetails(userId: string) {
    try {
      const userData = await UserModel.findById(userId);
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async updateSessionStatus(bookingId: string) {
    try {
      const bookingDetails = await this.bookingModel.findByIdAndUpdate(
        { _id: bookingId },
        { paymentStatus: "Completed" },
        { new: true }
      );

      if (!bookingDetails) {
        throw new Error("Booking not found");
      }

      let wallet = await this.walletModel.findOne({
        trainerId: bookingDetails.trainerId,
      });

      const transactionId =
        "txn_" + Date.now() + Math.floor(Math.random() * 10000);
      if (bookingDetails.amount) {
        const transactionAmount = 0.9 * bookingDetails.amount;
        const transaction: ITransaction = {
          amount: transactionAmount,
          transactionId: transactionId,
          transactionType: "credit",
          bookingId: bookingId,
          date: new Date(),
        };

        if (wallet) {
          wallet.transactions.push(transaction);
          wallet.balance += transactionAmount;
          await wallet.save();
        } else {
          wallet = new this.walletModel({
            trainerId: bookingDetails.trainerId,
            balance: transactionAmount,
            transactions: [transaction],
          });
          await wallet.save();
        }
      }

      return bookingDetails;
    } catch (error) {
      console.error("Error updating session status:", error);
      throw error;
    }
  }

  async fetchWalletData(trainer_id: string) {
    try {
      const walletData = await this.walletModel.findOne({
        trainerId: trainer_id,
      });
      return walletData;
    } catch (error) {}
  }

  async withdrawMoney(trainer_id: string, amount: number) {
    try {
      const wallet = await this.walletModel.findOne({ trainerId: trainer_id });

      if (!wallet) {
        throw new Error("Wallet not found for the specified Trainer.");
      }

      if (wallet.balance < amount) {
        throw new Error("Insufficient balance for withdrawal.");
      }

      wallet.balance -= amount;

      const transactionId =
        "txn_" + Date.now() + Math.floor(Math.random() * 10000);
      const transaction: ITransaction = {
        amount: amount,
        transactionId: transactionId,
        transactionType: "debit",
      };
      wallet.transactions.push(transaction);
      await wallet.save();

      return wallet;
    } catch (error: any) {
      console.error("Error processing withdrawal:", error.message);
      throw new Error(error.message);
    }
  }

  static async getIsBlockedTrainer(trainer_id: string): Promise<boolean> {
    try {
      const trainer = await TrainerModel.findById(trainer_id);
      return trainer?.isBlocked ?? false;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch trainer's blocked status: ${error.message}`
      );
    }
  }
}

export default TrainerRepository;
