import { Request, Response } from "express";
import UserService from "../services/userService";
import { IUser, ILoginUser } from "../interface/common";
import jwt from 'jsonwebtoken'

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  // Register user and send OTP to email
  async register(req: Request, res: Response) {
    try {
      const userData: IUser = req.body;
      // console.log('User data received for registration:', userData);

      await this.userService.register(userData);
      res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
      console.error("Register Controller error:", error);

      if ((error as Error).message === "Email already exists") {
        res.status(409).json({ message: "Email already exists" });
      } else {
        res
          .status(500)
          .json({ message: "Something went wrong, please try again later" });
      }
    }
  }

  // Login user
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: ILoginUser = req.body;
      
      const user = await this.userService.login({ email, password });
  
      if (user) {
        const { accessToken, refreshToken } = user;

        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true, 
          maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
  
        res.status(200).json({
          message: "Login successful",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone
          },
          token: accessToken,
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      console.log("Login controller:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  

  // Verify OTP
  async verifyOtp(req: Request, res: Response) {
    try {
      console.log("verify otp controller");

      const { userData, otp } = req.body;

      await this.userService.verifyOTP(userData, otp);

      res
        .status(200)
        .json({ message: "OTP verified successfully", user: userData });
    } catch (error) {
      console.error("OTP Verification Controller error:", error);

      if ((error as Error).message === "OTP has expired") {
        res.status(400).json({ message: "OTP has expired" });
      } else if ((error as Error).message === "Invalid OTP") {
        res.status(400).json({ message: "Invalid OTP" });
      } else if ((error as Error).message === "No OTP found for this email") {
        res.status(404).json({ message: "No OTP found for this email" });
      } else {
        res
          .status(500)
          .json({ message: "Something went wrong, please try again later" });
      }
    }
  }

  // Resend OTP
  async resendOtp(
    req: Request<{ email: string }>,
    res: Response
  ): Promise<void> {
    try {
      const { email } = req.body;

      await this.userService.resendOTP(email);
      res.status(200).json({ message: "OTP resent successfully" });
    } catch (error) {
      console.error("Resend OTP Controller error:", error);
      if ((error as Error).message === "User not found") {
        res.status(404).json({ message: "User not found" });
      } else {
        res
          .status(500)
          .json({ message: "Failed to resend OTP. Please try again later." });
      }
    }
  }

 

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      
        res.clearCookie("refresh_token", {
            httpOnly: true,
            sameSite: "none", 
            secure: true      
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);

        res.status(500).json({ message: "Logout failed", error });
    }
};

  

}

export default UserController;
