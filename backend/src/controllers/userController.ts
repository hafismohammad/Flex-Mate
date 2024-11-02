import { Request, Response } from "express";
import UserService from "../services/userService";
import { IUser, ILoginUser } from "../interface/common";
import stripe from "../config/stripeClient";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  // Register user and send OTP to email
  async register(req: Request, res: Response) {
    try {
      const userData: IUser = req.body;

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
    console.log("login route hit");

    const { email, password }: ILoginUser = req.body;

    const user = await this.userService.login({ email, password });

    if (user) {
      console.log("user", user);

      const { accessToken, refreshToken } = user;

      // Set refresh token as cookie
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Login successful",
        user: user.user,
        token: accessToken,
      });
    }

  } catch (error: any) {
    // Handle specific errors
    if (error.message === "User is blocked") {
      res.status(403).json({ message: "User is blocked" });
    } else if (error.message === "Invalid email or password") {
      res.status(401).json({ message: "Invalid email or password" });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
}


  async refreshToken(req: Request, res: Response) {
    const refresh_token = req.cookies?.refresh_token;

    if (!refresh_token) {
      res.status(403).json({ message: "Refresh token not found" });
      return;
    }

    try {
      const newAccessToken = await this.userService.generateTokn(
        refresh_token
      );

      const UserNewAccessToken = Object.assign(
        {},
        { accessToken: newAccessToken }
      );

      // console.log('new token', UserNewAccessToken);

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error("Error generating new access token:", error);
      res.status(500).json({ message: "Failed to refresh token" });
    }
  }

  // Verify OTP
  async verifyOtp(req: Request, res: Response) {
    try {
      // console.log("verify otp controller");

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
        secure: true,
      });

      res.status(200).json({ message: "Logged out successfully", });
    } catch (error) {
      console.error("Logout error:", error);

      res.status(500).json({ message: "Logout failed", error });
    }
  };

  async getAllTrainers(req: Request, res: Response) {
    try {
      
      const allTrainers = await this.userService.fetchAllTrainers();
      console.log(allTrainers);
      
      res.status(200).json(allTrainers);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      res.status(500).json({ message: 'Error fetching trainers' });
    }
  }

  async getAllspecializations(req: Request, res: Response) {
    try {
      
      const allSpecializations = await this.userService.specializations()
      // console.log(allSpecializations);
      
      res.status(200).json(allSpecializations)
    } catch (error) {
      console.error('Error fetching trainers:', error);
      res.status(500).json({ message: 'Error fetching trainers' });
    }
  }

  async getTrainer(req: Request, res: Response) {
    try {
      const trainerId = req.params.trainerId;
      
      if (!trainerId) {
         res.status(400).json({ message: "Trainer ID is required" });
      }
  
      const trainer = await this.userService.getTrainer(trainerId);
      // console.log(trainer);
      
      if (!trainer) {
         res.status(404).json({ message: "Trainer not found" });
      }
  
      res.status(200).json(trainer);
    } catch (error) {
      console.error("Error in getTrainer controller:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getSessionSchedules(req: Request, res: Response) {
    try {

      const sessionSchedules = await this.userService.getSessionSchedules()
      res.status(200).json(sessionSchedules)
    } catch (error) {
      
    }
  }

  async checkoutPayment(req: Request, res: Response) {
    try {
      const userId = req.body.userData.id      
      const session_id = req.params.sessionId;  
      const paymentResponse = await this.userService.checkoutPayment(session_id, userId);
      res.status(200).json({ id: paymentResponse.id });
    } catch (error) {
      console.error('Error in checkoutPayment:', error);
      res.status(500).json({ message: 'Failed to create checkout session' });
    }
  }

  async createBooking(req: Request, res: Response) {
    try {
      const {sessionId, userId} = req.body
     const bookingDetails = await this.userService.findBookingDetails(sessionId, userId)

    } catch (error) {
      console.log('Error in create booking');
      res.status(500).json({message: 'Failed to create bookin'})
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const userId = req.params.userId
      const userData = await this.userService.fetchUserData(userId)
      res.status(200).json(userData)
    } catch (error) {
      console.log('Error getting user data');
      res.status(500).json({message: 'Failed to fetch user data'})
      
    }
  }

  async updateUserData(req: Request, res: Response) {
    try {
      const userData = req.body
      const userId = req.body._id
      await this.userService.updateUser(userData, userId)
      res.status(200).json({message: 'User Updated Successfully'})
    } catch (error) {
      console.error("Error updating user data:", error);
      res.status(500).json({ message: 'Error updating user data' });
    }
  }

}

export default UserController;
