// trainerController.ts

import { Request, Response } from "express";
import TrainerService from "../services/trainerServices";
import { ITrainer } from "../interface/trainer_interface";

class TrainerController {
  private trainerService: TrainerService;

  constructor(trainerService: TrainerService) {
    this.trainerService = trainerService;
  }

  async getAllSpecializations(req: Request, res: Response) {
    try {
      const specializationsData =
        await this.trainerService.findAllSpecializations();

      res.status(200).json({ success: true, data: specializationsData });
    } catch (error) {
      console.error(
        "Error in controller while fetching specializations:",
        error
      );
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch specializations" });
    }
  }

  async registerTrainer(req: Request, res: Response) {
    try {
      const trainerData: ITrainer = req.body;
      await this.trainerService.registerTrainer(trainerData);
      res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
      if ((error as Error).message === "Email already exists") {
        res.status(409).json({ message: "Email already exists" });
      } else {
        res
          .status(500)
          .json({ message: "Something went wrong, please try again later" });
      }
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const { trainerData, otp } = req.body;

      await this.trainerService.verifyOTP(trainerData, otp);
      res
        .status(200)
        .json({ message: "OTP verified successfully", treiner: trainerData });
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
    async resendOtp( req: Request<{ email: string }>,res: Response
    ): Promise<void> {
      try {
        const { email } = req.body;
console.log(email,'trainer cont');

        await this.trainerService.resendOTP(email);
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
  
  async trainerLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: ITrainer = req.body;

      const trainerData = await this.trainerService.trainerLogin({
        email,
        password,
      });

      if (trainerData) {
        const { accessToken, refreshToken, trainer } = trainerData;

        res.cookie("trainer_refresh_token", refreshToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
          message: "Login successful",
          trainer: trainer,
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

  async kycSubmission(req: Request, res: Response) {
    try {
      const formData = req.body;
      // console.log("Form data:", formData);

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const documents = [];
      if (files.document1) {
        documents.push(files.document1[0].filename);
      }
      if (files.document2) {
        documents.push(files.document2[0].filename);
      }

      // console.log("Documents:", documents);

     const kycStatus = await this.trainerService.kycSubmit(formData, documents);

      res.status(200).json({ message: "KYC submission successful", kycStatus });
    } catch (error) {
      console.error("Error in KYC submission:", error);
      res.status(500).json({ message: "Error in KYC submission", error });
    }
  }

  async logoutTrainer(req: Request, res: Response) {
    try {
      res.clearCookie("trainer_refresh_token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);

      res.status(500).json({ message: "Logout failed", error });
    }
  }

  async getAllKycStatus(req: Request, res: Response) {
    console.log("hit kyc statsu");
  }

  async trainerKycStatus(req: Request, res: Response) {
    try {
      
      const trainerId = req.params.trainerId;
      const kycStatus = await this.trainerService.kycStatus(trainerId);


      res.status(200).json({ kycStatus });
    } catch (error) {
      console.error("Error fetching trainer KYC status:", error);
      res.status(500).json({ message: "Failed to fetch trainer KYC status" });
    }
  }
}

export default TrainerController;
