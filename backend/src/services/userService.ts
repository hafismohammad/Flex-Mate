import { IUser, ILoginUser } from "../interface/common";
import {generateAccessToken, generateRefreshToken} from '../utils/jwtHelper'
import UserRepository from "../repositories/userRepository";
import sendOTPmail from "../config/email_config";
import bcrypt from "bcryptjs";

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
      const isMailSent = await sendOTPmail(userData.email, this.OTP);
      if (!isMailSent) {
        throw new Error("Email not sent");
      }

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
      console.log("user service");

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
          console.log('otp expiration not working');
          
          console.log("OTP is valid and verified",latestOtp.expiresAt);

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

      const isMailSent = await sendOTPmail(email, this.OTP);
      if (!isMailSent) {
        throw new Error("Failed to resend OTP email.");
      }

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
// console.log(userData);

    if (userData && userData.password) {
      const isPasswordMatch = await bcrypt.compare(password, userData.password);

      if (isPasswordMatch) {
        if (!userData._id) {
          throw new Error('User ID is missing');
        }

        // Generate access and refresh tokens
        const accessToken = generateAccessToken({ id: userData._id.toString(), email: userData.email });
        const refreshToken = generateRefreshToken({ id: userData._id.toString(), email: userData.email });

        return {
          accessToken,
          refreshToken,
          user: {
            id: userData._id.toString(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
          },
        };
      }
    } else {
      console.log('User not found');
      
    }

    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

async fetchAllTrainers() {
  try {
    const trainers = await this.userRepository.fetchAllTrainers();

    const approvedTrainers = trainers?.filter(trainer => trainer.kycStatus === 'approved' &&  trainer.isBlocked === false) || [];

    return approvedTrainers;
  } catch (error) {
    console.error('Error fetching trainers:', error);
    throw error; 
  }
}

async specializations() {
  try {
  const data = await this.userRepository.fetchSpecializations()
  return data
  
  } catch (error) {
    console.error('Error fetching trainers:', error);
    throw error; 
  }
}

async getTrainer(trainerId: string) {
  try {
    return await this.userRepository.getTrainer(trainerId)
  } catch (error) {
    
  }
}

async getSessionSchedules() {
  try {
    return await this.userRepository.fetchAllSessionSchedules()
  } catch (error) {
    
  }
}

}

export default UserService;
