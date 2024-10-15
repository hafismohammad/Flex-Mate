// trainerServices.ts

import TrainerRepository from "../repositories/trainerRepository";
import { ITrainer, ILoginTrainer } from "../interface/trainer_interface";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtHelper";
import sendOTPmail from "../config/email_config";
import bcrypt from "bcryptjs";

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
        console.log("Trainer already exists");
        throw new Error("Email already exists");
      }

      // Generate random OTP
      const generatedOTP: string = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      this.OTP = generatedOTP;

      console.log("Generated OTP is", this.OTP);
      // console.log('trainerData.email',trainerData.email);

      // Send OTP to trainer's email
      //   const isMailSent = await sendOTPmail(trainerData.email, this.OTP);
      //   if (!isMailSent) {
      //     throw new Error("Email not sent");
      //   }

      const OTP_createdTime = new Date();
      this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 1 * 60 * 1000);

      // Save OTP in the database
      await this.trainerRepository.saveOTP(
        trainerData.email,
        this.OTP,
        this.expiryOTP_time
      );

      console.log(`OTP will expire at: ${this.expiryOTP_time}`);
    } catch (error) {
      console.error("Error in service:", (error as Error).message);
      throw new Error("Error in Trainer service");
    }
  }

  async verifyOTP(trainerData: ITrainer, otp: string): Promise<void> {
    try {
        const validOtps = await this.trainerRepository.getOtpsByEmail(trainerData.email);

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

                const specialization = await this.trainerRepository.findTrainerSpecialization(trainerData.specialization);
                
                if (!specialization) {
                    throw new Error("Specialization not found");
                }

                const hashedPassword = await bcrypt.hash(trainerData.password, 10);
                
                const newTrainerData: ITrainer = {
                    ...trainerData,
                    password: hashedPassword,
                    specialization: specialization._id 
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
        const errorMessage = (error as Error).message || "An unknown error occurred";
        console.error("Error in OTP verification:", errorMessage);
        throw error;
    }
}

  

  // login trainer
  async trainerLogin({ email, password }: { email: string; password: string }) {
    try {
      // console.log('email',email);

      const trainerData = await this.trainerRepository.findTrainer(email);

      // Ensure both trainerData and trainerData._id are defined
      if (trainerData && trainerData._id) {
        const isPasswordValid = await bcrypt.compare(
          password,
          trainerData.password
        );

        if (!isPasswordValid) {
          console.log("Invalid password:", password);
          throw new Error("Password is wrong");
        }

        // Generate access and refresh tokens
        const accessToken = generateAccessToken({
          id: trainerData._id.toString(),
          email: trainerData.email,
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
            password: trainerData.password,
            phone: trainerData.phone,
            specialization: trainerData.specialization,
          },
        };
      } else {
        console.log("Trainer not exists");
      }
    } catch (error) {
      console.error("Error in trainer login:", error);
      throw error;
    }
  }

  async kycSubmit(formData: any, documents: any) {
    try {
      
      await this.trainerRepository.saveKyc(formData, documents);

      return await this.trainerRepository.changeKycStatus(formData.trainer_id)


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
}

export default TrainerService;