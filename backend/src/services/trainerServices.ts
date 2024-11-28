// trainerServices.ts

import TrainerRepository from "../repositories/trainerRepository";
import { ITrainer, ILoginTrainer } from "../interface/trainer_interface";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtHelper";
import sendOTPmail from "../config/email_config";
import bcrypt from "bcryptjs";
import { ISession } from "../interface/trainer_interface";
import { createRecurringSessions } from "../utils/slotHelper";
import { IBooking } from "../interface/common";

class TrainerService {
  private trainerRepository: TrainerRepository;
  private OTP: string | null = null;
  private expiryOTP_time: Date | null = null;

  constructor(trainerRepository: TrainerRepository) {
    this.trainerRepository = trainerRepository;
  }

  async findAllSpecializations() {
    try {
      return await this.trainerRepository.findAllSpecializations();
    } catch (error) {
      console.error("Error in service while fetching specializations:", error);
      throw error;
    }
  }

  async registerTrainer(trainerData: ITrainer) {
    try {
      const existingTrainer = await this.trainerRepository.existsTrainer(
        trainerData.email
      );

      if (existingTrainer) {
        return null;
      }

      // Generate random OTP
      const generatedOTP: string = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      this.OTP = generatedOTP;

      console.log("Generated OTP is", this.OTP);

      const OTP_createdTime = new Date();
      this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 1 * 60 * 1000);

      // Save OTP in the database
      await this.trainerRepository.saveOTP(
        trainerData.email,
        this.OTP,
        this.expiryOTP_time
      );

      console.log(`OTP will expire at: ${this.expiryOTP_time}`);

      // const isMailSent = await sendOTPmail(trainerData.email, this.OTP);
      // if (!isMailSent) {
      //   throw new Error("Email not sent");
      // }

      return { email: trainerData.email };
    } catch (error) {
      console.error("Error in service:", (error as Error).message);
      throw new Error("Error in Trainer service");
    }
  }

  async verifyOTP(trainerData: ITrainer, otp: string): Promise<void> {
    try {
      const validOtps = await this.trainerRepository.getOtpsByEmail(
        trainerData.email
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
          console.log("OTP is valid and verified", latestOtp.expiresAt);
  
          // Get ObjectIds for the specializations
          const specializationIds = await this.trainerRepository.findTrainerSpecializations(
            trainerData.specializations // Pass the ObjectId array
          );
  
          if (!specializationIds || specializationIds.length !== trainerData.specializations.length) {
            throw new Error("One or more specializations not found");
          }
  
          const hashedPassword = await bcrypt.hash(trainerData.password, 10);
  
          const newTrainerData: ITrainer = {
            ...trainerData,
            password: hashedPassword,
            specializations: specializationIds, 
          };
  
          // Create new trainer
          await this.trainerRepository.createNewTrainer(newTrainerData);
          await this.trainerRepository.deleteOtpById(latestOtp._id);
        } else {
          console.log("OTP has expired");
          await this.trainerRepository.deleteOtpById(latestOtp._id);
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

      await this.trainerRepository.saveOTP(
        email,
        this.OTP,
        this.expiryOTP_time
      );

      // const isMailSent = await sendOTPmail(email, this.OTP);
      // if (!isMailSent) {
      //   throw new Error("Failed to resend OTP email.");
      // }

      console.log(`Resent OTP ${this.OTP} to ${email}`);
    } catch (error) {
      console.error("Error in resendOTP:", (error as Error).message);
      throw error;
    }
  }

  // login trainer

  async trainerLogin({ email, password }: { email: string; password: string }) {
    try {
      const trainerData = await this.trainerRepository.findTrainer(email);

      if (trainerData && trainerData._id) {
        const isPasswordValid = await bcrypt.compare(
          password,
          trainerData.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        if (trainerData?.isBlocked) {
          throw new Error("Trainer is blocked");
        }
        const accessToken = generateAccessToken({
          id: trainerData._id.toString(),
          email: trainerData.email,
          role: 'trainer'
        });
        const refreshToken = generateRefreshToken({
          id: trainerData._id.toString(),
          email: trainerData.email,
        });

        return {
          accessToken,
          refreshToken,
          trainer: {
            id: trainerData._id.toString(),
            email: trainerData.email,
            phone: trainerData.phone,
            specialization: trainerData.specializations,
          },
        };
      } else {
        throw new Error("Trainer not exists");
      }
    } catch (error) {
      console.error("Error in trainer login:", error);
      throw error;
    }
  }

  async generateTokn(trainer_refresh_token: string) {
    try {
      const payload = verifyRefreshToken(trainer_refresh_token);
      // console.log('payload', payload);

      let id: string | undefined;
      let email: string | undefined;

      if (payload && typeof payload === "object") {
        id = payload?.id;
        email = payload?.email;
      }

      if (id && email) {
        const role = 'trainer'
        const TrainerNewAccessToken = generateAccessToken({ id, email, role });
        return TrainerNewAccessToken;
      } else {
        throw new Error("Invalid token payload structure");
      }
    } catch (error) {
      console.error("Error generating token:", error);
      throw error;
    }
  }

  async kycSubmit(formData: any, documents: any): Promise<any> {
    try {
      await this.trainerRepository.saveKyc(formData, documents);

      return await this.trainerRepository.changeKycStatus(
        formData.trainer_id,
        documents.profileImageUrl
      );
    } catch (error) {
      console.error("Error in kycSubmit service:", error);
      throw new Error("Failed to submit KYC data");
    }
  }

  async kycStatus(trainerId: string) {
    try {
      const kycStatus = await this.trainerRepository.getTrainerStatus(
        trainerId
      );
      return kycStatus;
    } catch (error) {
      console.error("Error in kycStatus service:", error);
      throw new Error("Failed to retrieve KYC status");
    }
  }

  async updateKycStatus(trainerId: string) {
    return await this.trainerRepository.updateKycStatus(trainerId);
  }
  async findTrainer(trainer_id: string) {
    try {
      return await this.trainerRepository.fetchTrainer(trainer_id);
    } catch (error: any) {
      throw Error(error);
    }
  }

  // Service Method
  async updateTrainer(trainer_id: string, trainerData: Partial<ITrainer>) {
    try {
      const {
        profileImage,
        name,
        email,
        phone,
        yearsOfExperience,
        gender,
        language,
        dailySessionLimit,
        about,
        specializations
      } = trainerData;

      // console.log("profileimage", profileImage);

      const existingTrainer = await this.trainerRepository.updateTrainerData(
        trainer_id
      );
      // console.log(existingTrainer);

      if (!existingTrainer) {
        throw new Error("Trainer not found");
      }
      if (profileImage) existingTrainer.profileImage = profileImage;
      if (name) existingTrainer.name = name;
      if (email) existingTrainer.email = email;
      if (phone) existingTrainer.phone = phone;
      if (yearsOfExperience)
        existingTrainer.yearsOfExperience = yearsOfExperience;
      if (gender) existingTrainer.gender = gender;
      if (language) existingTrainer.language = language;
      if (about) existingTrainer.about = about;
      if (dailySessionLimit)
        existingTrainer.dailySessionLimit = dailySessionLimit;

      if(Array.isArray(specializations)) {
        existingTrainer.specializations = specializations
      }

      await existingTrainer.save();

      return existingTrainer;
    } catch (error) {
      console.error("Error in service layer:", error);
      throw new Error("Failed to update trainer");
    }
  }

  async fetchSpec(trainer_id: string) {
    return this.trainerRepository.fetchSpec(trainer_id)
  }

  async fetchRejectionData(trainer_id: string) {
    try {
      return await this.trainerRepository.fetchRejectionData(trainer_id);
    } catch (error) {
      throw new Error("Error in fetching rejectin reason");
    }
  }

  async AddNewSession(sessionData: ISession, recurrenceOption: string) {
    try {
      const startTimeInput = sessionData.startTime;
      const endTimeInput = sessionData.endTime;

      const startTime = new Date(`1970-01-01T${startTimeInput}`);
      const endTime = new Date(`1970-01-01T${endTimeInput}`);

      if (startTime >= endTime) {
        throw new Error("End time must be after start time");
      }

      const MINIMUM_SESSION_DURATION = 30;
      const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

      if (duration < MINIMUM_SESSION_DURATION) {
        throw new Error("Session duration must be at least 30 minutes");
      }

      if (recurrenceOption === 'oneWeek' || recurrenceOption === 'twoWeek') {
        
        // Generate recurring sessions for either one week or two weeks
        const recurringSessions = await createRecurringSessions(sessionData.startDate, recurrenceOption, sessionData);
      
        // Create all recurring sessions at once in the repository
        return await this.trainerRepository.createMultipleSessions(recurringSessions);
      } else {
        // Handle single session creation
        return await this.trainerRepository.createNewSession(sessionData);
      }
      

    } catch (error: any) {
      if (error.message.includes("Daily session limit")) {
        throw new Error(error.message);
      } else if (error.message === "Time conflict with an existing session.") {
        throw new Error("Time conflict with an existing session.");
      } else if (error.message === "End time must be after start time") {
        throw new Error("End time must be after start time");
      } else if (
        error.message === "Session duration must be at least 30 minutes"
      ) {
        throw new Error("Session duration must be at least 30 minutes");
      } else {
        throw new Error("Error creating new session");
      }
    }
  }

  async getSessionShedules(trainer_id: string) {
    try {
      return await this.trainerRepository.fetchSessionData(trainer_id)
    } catch (error) {
      throw new Error("Error getting sessin shedule data");
    }
  }

  async deleteSession(session_id: string) {
    try {
      return await this.trainerRepository.deleteSession(session_id);
    } catch (error) {
      throw error;
    }
  }

  async getBookingDetails(trainer_id: string) {
    try {
      return await this.trainerRepository.fetchBookingDetails(trainer_id);
    } catch (error) {
      throw error;
    }
  }

  async fetchUser(userId: string) {
    return await this.trainerRepository.fetchUeserDetails(userId)
  }

  
  async sessionStatusChange(bookingId: string) {
    try {
    return await this.trainerRepository.updateSessionStatus(bookingId);
    } catch (error) {
      console.error('Error updating session status:', error);
    }
  }
  
  async getWallet(trainer_id: string) {
    return await this.trainerRepository.fetchWalletData(trainer_id)
  }

  async withdraw (trainer_id:string, amount: number)  {
    try {
      return await this.trainerRepository.withdrawMoney(trainer_id, amount)

    } catch (error) {
      
    }
  }
  
}

export default TrainerService;
