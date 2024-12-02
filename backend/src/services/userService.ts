import { IUser, ILoginUser, IBooking } from "../interface/common";
import { differenceInHours } from 'date-fns';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtHelper";
import UserRepository from "../repositories/userRepository";
import sendMail from "../config/email_config";
import bcrypt from "bcryptjs";
import stripe from "../config/stripeClient";
import mongoose from "mongoose";
import { User } from "../interface/user_interface";

class UserService {
  private userRepository: UserRepository;
  private OTP: string | null = null;
  private expiryOTP_time: Date | null = null;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  // User registration with OTP generation and sending logic
  async register(userData: IUser): Promise<void> {
    try {
      console.log("generate otp", userData);
      const existingUser = await this.userRepository.existsUser(userData.email);

      if (existingUser) {
        console.log("User already exists");
        throw new Error("Email already exists");
      }

      // Generate random OTP
      const generatedOTP: string = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      this.OTP = generatedOTP;

      console.log("Generated OTP is", this.OTP);

      // Send OTP to user's email
      // const isMailSent = await sendMail('otp',userData.email, this.OTP);
      // if (!isMailSent) {
      //   throw new Error("Email not sent");
      // }

      const OTP_createdTime = new Date();
      this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 1 * 60 * 1000);

      // Save OTP in the database
      await this.userRepository.saveOTP(
        userData.email,
        this.OTP,
        this.expiryOTP_time
      );

      console.log(`OTP will expire at: ${this.expiryOTP_time}`);
    } catch (error) {
      console.error("Error in service:", (error as Error).message);
      throw new Error("Error in user service");
    }
  }

  // OTP verification logic
  async verifyOTP(userData: IUser, otp: string): Promise<void> {
    try {
      // console.log("user service");

      const validOtps = await this.userRepository.getOtpsByEmail(
        userData.email
      );

      if (validOtps.length === 0) {
        console.log("No OTP found for this email");
        throw new Error("No OTP found for this email");
      }

      const latestOtp = validOtps.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )[0];

      if (latestOtp.otp === otp) {
        if (latestOtp.expiresAt > new Date()) {
          console.log("otp expiration not working");

          console.log("OTP is valid and verified", latestOtp.expiresAt);

          const hashedPassword = await bcrypt.hash(userData.password, 10);
          const newUserData = { ...userData, password: hashedPassword };

          // Create new user
          await this.userRepository.createNewUser(newUserData);

          await this.userRepository.deleteOtpById(latestOtp._id);
        } else {
          console.log("OTP has expired");
          await this.userRepository.deleteOtpById(latestOtp._id);
          throw new Error("OTP has expired");
        }
      } else {
        console.log("Invalid OTP");
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred";
      console.error("Error in OTP verification:", errorMessage);
      throw error;
    }
  }

  async resendOTP(email: string): Promise<void> {
    try {
      const generatedOTP: string = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      this.OTP = generatedOTP;

      const OTP_createdTime = new Date();
      this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 1 * 60 * 1000);

      await this.userRepository.saveOTP(email, this.OTP, this.expiryOTP_time);

      // const isMailSent = await sendMail('otp',email, this.OTP);
      // if (!isMailSent) {
      //   throw new Error("Failed to resend OTP email.");
      // }

      console.log(`Resent OTP ${this.OTP} to ${email}`);
    } catch (error) {
      console.error("Error in resendOTP:", (error as Error).message);
      throw error;
    }
  }

  // login user
  async login({ email, password }: ILoginUser): Promise<any> {
    try {
      const userData: IUser | null = await this.userRepository.findUser(email);

      if (userData) {
        if (userData.isBlocked) {
          throw new Error("User is blocked");
        }

        const isPasswordMatch = await bcrypt.compare(
          password,
          userData.password || ""
        );

        if (isPasswordMatch) {
          if (!userData._id) {
            throw new Error("User ID is missing");
          }
          
          // Generate access and refresh tokens
          const accessToken = generateAccessToken({
            id: userData._id.toString(),
            email: userData.email,
            role: 'user'
          });
          const refreshToken = generateRefreshToken({
            id: userData._id.toString(),
            email: userData.email,
          });

          return {
            accessToken,
            refreshToken,
            user: {
              id: userData._id.toString(),
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              isBlocked: userData.isBlocked,
            },
          };
        }
      }

      throw new Error("Invalid email or password");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async generateTokn(user_refresh_token: string) {
    try {
      const payload = verifyRefreshToken(user_refresh_token);
      // console.log('payload', payload);

      let id: string | undefined;
      let email: string | undefined;

      if (payload && typeof payload === "object") {
        id = payload?.id;
        email = payload?.email;
      }

      if (id && email) {
        const role = 'user'
        const userNewAccessToken = generateAccessToken({ id, email,role });
        return userNewAccessToken;
      } else {
        throw new Error("Invalid token payload structure");
      }
    } catch (error) {
      console.error("Error generating token:", error);
      throw error;
    }
  }

  async fetchAllTrainers() {
    try {
      const trainers = await this.userRepository.fetchAllTrainers();

      const approvedTrainers =
        trainers?.filter(
          (trainer) =>
            trainer.kycStatus === "approved" && trainer.isBlocked === false
        ) || [];

      return approvedTrainers;
    } catch (error) {
      console.error("Error fetching trainers:", error);
      throw error;
    }
  }

  async specializations() {
    try {
      const data = await this.userRepository.fetchSpecializations();
      return data;
    } catch (error) {
      console.error("Error fetching trainers:", error);
      throw error;
    }
  }

  async getTrainer(trainerId: string) {
    try {
      return await this.userRepository.getTrainer(trainerId);
    } catch (error) {}
  }

  async getSessionSchedules() {
    try {
      return await this.userRepository.fetchAllSessionSchedules();
    } catch (error) {}
  }

  async checkoutPayment(session_id: string, userId: string) {
    try {
      const sessionData = await this.userRepository.findSessionDetails(session_id);
  
      if (!sessionData || !sessionData.trainerId || !sessionData.price) {
        throw new Error("Missing session data, trainer ID, or price");
      }
  
      const trainer_id = sessionData.trainerId.toString();
      const trainerData = await this.userRepository.findTrainerDetails(trainer_id);
  
      if (!trainerData) {
        throw new Error("Trainer data not found");
      }
  
      const lineItems = [
        {
          price_data: {
            currency: "inr",
            unit_amount: sessionData.price * 100,
            product_data: {
              name: `Trainer Name: ${trainerData.name} - (${trainerData.specialization})`,
              description: sessionData.isSingleSession
                ? `Description: Session from ${sessionData.startTime} to ${sessionData.endTime} on ${sessionData.startDate.toLocaleDateString()}`
                : `Description: Session from ${sessionData.startTime} to ${sessionData.endTime} on ${sessionData.startDate.toLocaleDateString()} to ${sessionData.endDate.toLocaleDateString()}`,
            },
          },
          quantity: 1,
        },
      ];
  
      // Now define `session` only once it is assigned a value
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `http://localhost:5173/paymentSuccess?session_id=${sessionData._id}&user_id=${userId}&stripe_session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/paymentFailed`,
      });
  
      return session;  
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      throw error;
    }
  }

  async findBookingDetails(session_id: string, user_id: string, stripe_session_id: string) {
    try {
      const session = await this.userRepository.findSessionDetails(session_id);
      if (session) {
        session.status = "Confirmed";
        await session.save();
      }
      const trainerId = session?.trainerId;
      if (!trainerId) {
        throw new Error("Trainer ID is not available in the session.");
      }
  
      const trainer = await this.getTrainer(trainerId.toString());
  
      const sessionData = await stripe.checkout.sessions.retrieve(stripe_session_id);
      console.log('sessionData', sessionData);
  
      if (!trainer || trainer.length === 0) {
        throw new Error("Trainer not found.");
      }
  
      const bookingDetails: IBooking = {
        sessionId: new mongoose.Types.ObjectId(session._id),
        trainerId: new mongoose.Types.ObjectId(trainer[0]._id),
        userId: new mongoose.Types.ObjectId(user_id),
        specialization: session.specializationId.name,
        sessionType: session.isSingleSession ? "Single Session" : "Package Session",
        bookingDate: new Date(),
        startDate: session.startDate,
        endDate: session.endDate,
        startTime: session.startTime,
        endTime: session.endTime,
        amount: session.price,
        paymentStatus: "Confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
        payment_intent: sessionData.payment_intent ? sessionData.payment_intent.toString() : undefined
      };
  
      const existingBooking = await this.userRepository.findExistingBooking(bookingDetails);
      if (existingBooking) {
        console.log("Booking already exists.");
        throw new Error("Booking already exists.");
      }
  
      await this.userRepository.createBooking(bookingDetails);
      return bookingDetails;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw new Error("Failed to fetch booking details.");
    }
  }
  

  async fetchUserData(userId: string) {
    try {
      return await this.userRepository.fetchUser(userId);
    } catch (error) {
      throw new Error("Error fetching user");
    }
  }

  async updateUser(userdata: User, userId: string) {
    try {
      return await this.userRepository.updateUser(userdata, userId);
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }
  async uploadProfileImage(imagUrl: string, user_id: string) {
    try {
      return await this.userRepository.uploadPfileImage(imagUrl, user_id);
    } catch (error) {
      console.log(error);
    }
  }

  async getAllBookings(user_id: string) {
    try {
      return await this.userRepository.fetchBookings(user_id);
    } catch (error) {
      console.log(error);
    }
  }

  async cancelBooking(bookingId: string) {
    try {
      const bookingData = await this.userRepository.FetchBooking(bookingId);
  
      if (!bookingData) throw new Error("Booking not found");
  
      if (bookingData.paymentStatus !== 'Confirmed') {
        throw new Error("Booking is not confirmed or has already been canceled");
      }
  
      if (typeof bookingData.amount !== 'number') {
        throw new Error("Booking amount is undefined or invalid");
      }
  
      const sessionStartDate = new Date(bookingData.startDate);
      const hoursLeft = differenceInHours(sessionStartDate, new Date());
      
      let refundPercentage = 0;
      if (hoursLeft > 24) {
        refundPercentage = 1; // 100% refund
      } else if (hoursLeft > 6) {
        refundPercentage = 0.5; // 50% refund
      } else {
        refundPercentage = 0; // No refund
      }
  
      if (refundPercentage === 0) {
        bookingData.paymentStatus = 'Cancelled';
        await bookingData.save();
        console.log('booking cancelled without refund:', bookingData);
        return bookingData;
      }
  
      const refundAmount = Math.floor(bookingData.amount * refundPercentage);
  
      const refund = await stripe.refunds.create({
        payment_intent: bookingData.payment_intent, 
        amount: refundAmount
      });
  
      if (refund.status === 'succeeded') {
        bookingData.paymentStatus = 'Cancelled';
        await bookingData.save();
      } else {
        throw new Error("Refund failed or is incomplete");
      }
  
      return bookingData;
    } catch (error) {
      console.error("Error in cancelBooking service:", error);
      throw error;
    }
  }
  
  async addReview(reviewComment: string, selectedRating: number, userId: string, trainerId: string) {
    try {
      return await this.userRepository.createReview(reviewComment, selectedRating, userId, trainerId)
    } catch (error) {
      throw new Error('Failed to create review');
    }
  }

  async editReview(reviewComment: string, selectedRating: number,userReviewId: string) {
    try {
      return await this.userRepository.editReview(reviewComment, selectedRating, userReviewId)
    } catch (error) {
      throw new Error('Failed to create review');
    }
  }
  async reviews(trainer_id: string) {
    try {
      return await this.userRepository.getReview(trainer_id)
    } catch (error) {
      throw new Error('failed to find review')    
    }
  }
 async findBookings(user_id: string, trainerId: string) {
  try {
    const bookingData = await this.userRepository.findBookings(user_id, trainerId)
    return bookingData?.paymentStatus
    // if(bookingData.length === 0) {
    //   return false
    // } else {
    //   return true
    // }
  } catch (error) {
    throw new Error('failed to find booking') 
  }
 }
  
}

export default UserService;
