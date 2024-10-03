import { Request, Response } from "express";
import UserService from "../services/userService";
import { IUser } from "../interface/common";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  // Register user and send OTP to email
  async register(req: Request, res: Response) {
    try {
      const userData: IUser = req.body; 
      console.log('User data received for registration:', userData);
      
      await this.userService.register(userData);
      res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
      console.error("Register Controller error:", error);
      
      if ((error as Error).message === 'Email already exists') {
        res.status(409).json({ message: "Email already exists" });
      } else {
        res.status(500).json({ message: "Something went wrong, please try again later" });
      }
    }
  }

  // Verify OTP
  async verifyOtp(req: Request, res: Response) {
    try {
      const { userData, otp } = req.body;
      
      await this.userService.verifyOTP(userData, otp);
      
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("OTP Verification Controller error:", error);
      
      if ((error as Error).message === 'OTP has expired') {
        res.status(400).json({ message: 'OTP has expired' });
      } else if ((error as Error).message === 'Invalid OTP') {
        res.status(400).json({ message: 'Invalid OTP' });
      } else if ((error as Error).message === 'No OTP found for this email') {
        res.status(404).json({ message: 'No OTP found for this email' });
      } else {
        res.status(500).json({ message: "Something went wrong, please try again later" });
      }
    }
  }
}

export default UserController;
