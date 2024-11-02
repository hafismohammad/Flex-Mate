import { IUser, IOtp, IBooking } from "../interface/common";
import UserModel from "../models/userModel";
import OtpModel from "../models/otpModel";
import mongoose from "mongoose";
import TrainerModel from "../models/trainerModel";
import SpecializationModel from "../models/specializationModel";
import SessionModel from "../models/sessionModel";
import BookingModel from "../models/booking";
import { User } from "../interface/user_interface";

class UserRepository {
  private userModel = UserModel;
  private otpModel = OtpModel;
  private trainerModel = TrainerModel;
  private specializationModel = SpecializationModel;
  private sessionModel = SessionModel;
  private bookingModel = BookingModel;
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
      console.log("dff");

      const trainers = await this.trainerModel
        .find({})
        .populate("specialization");
      return trainers;
    } catch (error) {
      console.error("Error fetching trainers from the database:", error);
      throw error;
    }
  }

  async fetchSpecializations() {
    try {
      const data = await this.specializationModel.find({});
      return data;
    } catch (error) {
      console.error("Error fetching specializations from the database:", error);
      throw error;
    }
  }

  async getTrainer(trainerId: string) {
    try {
      const trainer = await this.trainerModel
        .find({ _id: trainerId })
        .populate("specialization");
      // console.log(trainer);

      return trainer;
    } catch (error) {}
  }

  async fetchAllSessionSchedules() {
    try {
      const schedules = await this.sessionModel.find({});
      return schedules;
    } catch (error) {}
  }

  async deleteExpiredUnbookedSessions(currentDate: Date): Promise<number> {
    const result = await this.sessionModel.deleteMany({
      startDate: { $lt: currentDate },
      status: "Pending",
    });

    return result.deletedCount || 0;
  }

  async findSessionDetails(session_id: string) {
    return await this.sessionModel.findById(session_id);
  }

  async findTrainerDetails(trainer_id: string) {
    const trainerData = await this.trainerModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(trainer_id) } },
      {
        $lookup: {
          from: "specializations",
          localField: "specialization",
          foreignField: "_id",
          as: "specializationData",
        },
      },
      {
        $unwind: {
          path: "$specializationData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          specialization: "$specializationData",
          kycStatus: 1,
          isBlocked: 1,
          createdAt: 1,
          updatedAt: 1,
          profileImage: 1,
          gender: 1,
          language: 1,
          yearsOfExperience: 1,
          dailySessionLimit: 1,
        },
      },
    ]);

    return trainerData[0];
  }

  static async getIsBlockedUser(user_id: string): Promise<boolean> {
    try {
      const user = await UserModel.findById(user_id);
      return user?.isBlocked ?? false;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch user's blocked status: ${error.message}`
      );
    }
  }

  async findExistingBooking(bookingDetails: IBooking) {
    try {
      const existingBooking = await this.bookingModel.findOne({
        sessionId: bookingDetails.sessionId,
        userId: bookingDetails.userId,
      });
      await this.sessionModel.findByIdAndUpdate(
        { _id: bookingDetails.sessionId },
        { isBooked: true },
        { new: true }
      );
      return existingBooking;
    } catch (error) {
      console.error("Error finding existing booking:", error);
      throw new Error("Failed to find existing booking.");
    }
  }

  async createBooking(bookingDetails: IBooking) {
    try {
      // Create a new booking using the Booking model
      const newBooking = await this.bookingModel.create(bookingDetails);
      console.log("Booking created successfully:", newBooking);
      return newBooking;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw new Error("Failed to create booking.");
    }
  }

  async fetchUser(userId: string) {
    try {
      const userData = await this.userModel.findById(userId)
      return userData
    } catch (error) {
      throw new Error('Error fetching user')
    }
  }

  async updateUser(userdata: User, userId: string) {
    try {
      
     const updatedUser = await this.userModel.findByIdAndUpdate(
        {_id: userId},
        { $set: userdata },
        { new: true }
      )
      return updatedUser
    } catch (error) {
      console.error("Error updating user:", error);
    throw new Error("Failed to update user");
    }
  } 

  async uploadPfileImage(imagUrl: string, user_id: string) {
    try {
      const profileImageUpdate = await this.userModel.findByIdAndUpdate({_id: user_id}, {image: imagUrl})
      return profileImageUpdate
    } catch (error) {
      
    }
  }
}

export default UserRepository;
