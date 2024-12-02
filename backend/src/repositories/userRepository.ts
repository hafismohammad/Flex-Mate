import { IUser, IOtp, IBooking } from "../interface/common";
import UserModel from "../models/userModel";
import OtpModel from "../models/otpModel";
import mongoose from "mongoose";
import TrainerModel from "../models/trainerModel";
import SpecializationModel from "../models/specializationModel";
import SessionModel from "../models/sessionModel";
import BookingModel from "../models/booking";
import { User } from "../interface/user_interface";
import { ISpecialization } from "../interface/trainer_interface";
import ReviewModel from "../models/reviewMolel";

class UserRepository {
  private userModel = UserModel;
  private otpModel = OtpModel;
  private trainerModel = TrainerModel;
  private specializationModel = SpecializationModel;
  private sessionModel = SessionModel;
  private bookingModel = BookingModel;
  private reviewModel =  ReviewModel

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

      const trainers = await this.trainerModel
        .find({})
        .populate("specializations");
        // console.log('trainers', trainers);
        
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
        .populate("specializations");
      // console.log(trainer);

      return trainer;
    } catch (error) {}
  }

  async fetchAllSessionSchedules() {
    try {
      const schedules = await this.sessionModel.find({}).populate('specializationId')
      // console.log('specId', schedules);
      
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
    return await this.sessionModel.findById(session_id).populate<{ specializationId: ISpecialization }>("specializationId");
  }

  async findTrainerDetails(trainer_id: string) {
    const trainerData = await this.trainerModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(trainer_id) } },
      {
        $lookup: {
          from: "specializations",
          localField: "specializations",
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
          specialization: "$specializationData.name",
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
// console.log("trainerData", trainerData);

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
      console.log('findExistingBooking');
      
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

  async fetchBookings(user_id: string) {
    const allBookings = await this.bookingModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(user_id) } },
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
      {
        $unwind: {
          path: '$trainerDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$sessionDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      
      {
        $project: {
          trainerId: '$trainerDetails._id',
          trainerImage: '$trainerDetails.profileImage',
          trainerName: '$trainerDetails.name',
          trainerEmail: '$trainerDetails.email',
          specialization: '$specialization', 
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
          startTime: '$startTime',
          endTime: '$endTime',
          sessionType: '$sessionType',
          bookingStatus: '$paymentStatus',
          bookingDate: '$bookingDate',
          prescription: '$prescription'
        },
      },
      {
        $sort: {
          bookingDate: -1, 
        },
      },
    ]);
    
    
    
    return allBookings
  }

  async FetchBooking(bookingId: string) {
    try {
        const bookingData = await this.bookingModel.findById(bookingId);
        return bookingData;
    } catch (error) {
        console.error("Error fetching booking:", error);
        throw error;
    }
}

async createReview(
  reviewComment: string, selectedRating: number, userId: string, trainerId: string
) {
  try {
    const data = {
      userId: new mongoose.Types.ObjectId(userId), 
      trainerId: new mongoose.Types.ObjectId(trainerId), 
      rating: selectedRating,
      comment: reviewComment,
    };

    const addReview = await this.reviewModel.create(data); 

    return addReview; 
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
}

async editReview(
  reviewComment: string, selectedRating: number, userReviewId: string
) {
  try {
console.log('userReviewId',userReviewId);


    // const data = {
    //   userId: new mongoose.Types.ObjectId(userId), 
    //   trainerId: new mongoose.Types.ObjectId(trainerId), 
    //   rating: selectedRating,
    //   comment: reviewComment,
    // };

    const review = await this.reviewModel.findByIdAndUpdate(
      userReviewId,
      { comment: reviewComment, rating: selectedRating }, 
      { new: true }
    );
    
    console.log(review);
    

    // return addReview; 

    
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
}


async getReview(trainer_id: string) {
  try {
    const reviews = await this.reviewModel.aggregate([
      {
        $match: { trainerId: new mongoose.Types.ObjectId(trainer_id) }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: {
          path: '$userDetails'
        }
      },
      {
        $project: {
          review_id: '$_id',
          comment: '$comment',
          rating: '$rating',
          userName: '$userDetails.name',
          userImage: '$userDetails.image',
          userId: '$userDetails._id',
          createdAt: 1 
        }
      },
      {
        $sort: {
          createdAt: -1 
        }
      }
    ]);

    return reviews;
  } catch (error) {
    console.error('Error finding review:', error);
    throw new Error('Failed to find review');
  }
}


async findBookings(user_id: string, trainer_id: string) {
  try {
    const bookingData = await this.bookingModel.findOne({userId: user_id, trainerId: trainer_id})
    
    return bookingData   
    // const bookingDataCount = await this.bookingModel.countDocuments({userId :user_id})
    // return bookingDataCount    
  } catch (error) {
    console.error('Error finding bookings:', error);
    throw new Error('Failed to find bookings');
  }
}

}

export default UserRepository;
