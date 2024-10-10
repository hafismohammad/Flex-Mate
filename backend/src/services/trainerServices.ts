// trainerServices.ts

import TrainerRepository from "../repositories/trainerRepository";
import { ITrainer } from "../interface/trainer_interface";
import sendOTPmail from "../config/email_config";

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
console.log('trainer otp', this.OTP);

      console.log("Generated OTP is", this.OTP);
// console.log('trainerData.email',trainerData.email);

      // Send OTP to user's email
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
}

export default TrainerService;
