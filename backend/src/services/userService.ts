import { IUser } from '../interface/common';
import UserRepository from '../repositories/userRepository';
import sendOTPmail from '../config/email_config';

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
      console.log('generate otp', userData);
      const existingUser = await this.userRepository.existsUser(userData.email);

      if (existingUser) {
        console.log('User already exists');
        throw new Error('Email already exists');
      }

      // Generate random OTP
      const generatedOTP: string = Math.floor(1000 + Math.random() * 9000).toString();
      this.OTP = generatedOTP;

      console.log('Generated OTP is', this.OTP);

      // Send OTP to user's email
      const isMailSent = await sendOTPmail(userData.email, this.OTP);
      if (!isMailSent) {
        throw new Error('Email not sent');
      }

      // Set OTP expiration time (2 minutes from current time)
      const OTP_createdTime = new Date();
      this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000); // 2 minutes

      // Save OTP in the database
      await this.userRepository.saveOTP(userData.email, this.OTP, this.expiryOTP_time);

      console.log(`OTP will expire at: ${this.expiryOTP_time}`);
    } catch (error) {
      console.error("Error in service:", (error as Error).message);
      throw new Error("Error in user service");
    }
  }

  // OTP verification logic
  async verifyOTP(userData: IUser, otp: string): Promise<void> {
    try {
      const validOtps = await this.userRepository.getOtpsByEmail(userData.email);

      if (validOtps.length === 0) {
        console.log('No OTP found for this email');
        throw new Error('No OTP found for this email');
      }

      const latestOtp = validOtps.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

      if (latestOtp.otp === otp) {
        if (latestOtp.expiresAt > new Date()) {
          console.log('OTP is valid and verified');
          
          // Create new user
          await this.userRepository.createNewUser(userData);

          // Delete OTP after verification
          await this.userRepository.deleteOtpById(latestOtp._id); 
        } else {
          console.log('OTP has expired');
          throw new Error('OTP has expired');
        }
      } else {
        console.log('Invalid OTP');
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      const errorMessage = (error as Error).message || 'An unknown error occurred';
      console.error('Error in OTP verification:', errorMessage);
      throw error;
    }
  }
}

export default UserService;
