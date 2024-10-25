// trainerController.ts

import { Request, Response } from "express";
import TrainerService from "../services/trainerServices";
import { ITrainer } from "../interface/trainer_interface";
import {uploadToCloudinary} from '../config/cloudinary'
import fs from 'fs'; 
import sharp from "sharp";
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
  
      // Call the service to register the trainer
      const trainer = await this.trainerService.registerTrainer(trainerData);
  
      // Check if the trainer already exists
      if (!trainer) {
        // If trainer is null, it means the email already exists
         res.status(409).json({ message: "Email already exists" });
         return
      }
  
      // If the registration is successful, send the OTP response
       res.status(200).json({ message: "OTP sent to email" });
       return
    } catch (error) {
      console.error('Error in registerTrainer:', error);
      if ((error as Error).message === "Email already exists") {
         res.status(409).json({ message: "Email already exists" });
         return
      } else {
         res.status(500).json({ message: "Something went wrong, please try again later" });
         return
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
  async resendOtp(
    req: Request<{ email: string }>,
    res: Response
  ): Promise<void> {
    try {
      const { email } = req.body;
      // console.log(email,'trainer cont');

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
          secure: true, 
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000, 
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

  async refreshToken(req: Request, res: Response) {
    const trainer_refresh_token = req.cookies?.trainer_refresh_token;
  
    if (!trainer_refresh_token) {
      res.status(403).json({ message: "Refresh token not found" });
      return;
    }
  
    try {
      // Wait for the new access token to be generated
      const newAccessToken = await this.trainerService.generateTokn(trainer_refresh_token);
  
      // Ensure the new access token is a plain object (although usually it's just a string)
      const TrainerNewAccessToken = Object.assign({}, { accessToken: newAccessToken });
  
      // console.log('new token', TrainerNewAccessToken);
  
      // Send the new access token as a response
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error('Error generating new access token:', error);
      res.status(500).json({ message: "Failed to refresh token" });
    }
  }
  

  async kycSubmission(req: Request, res: Response): Promise<void> {
    try {
      const { trainer_id, specialization, name, email, phone } = req.body;
  
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
  
      const documents: { [key: string]: string | undefined } = {};
  

      
      if (files.profileImage && files.profileImage[0]) {
        const profileImageUrl = await uploadToCloudinary(files.profileImage[0].buffer, 'trainer_profileImage');
        documents.profileImageUrl = profileImageUrl.secure_url;

        
      }
  
      if (files.aadhaarFrontSide && files.aadhaarFrontSide[0]) {
        const aadhaarFrontSideUrl = await uploadToCloudinary(files.aadhaarFrontSide[0].buffer, 'trainer_aadhaarFrontSidec');
        documents.aadhaarFrontSideUrl = aadhaarFrontSideUrl.secure_url;
      }
  
      if (files.aadhaarBackSide && files.aadhaarBackSide[0]) {
        const aadhaarBackSideUrl = await uploadToCloudinary(files.aadhaarBackSide[0].buffer, 'trainer_aadhaarBackSide');
        documents.aadhaarBackSideUrl = aadhaarBackSideUrl.secure_url;
      }
      
      if (files.certificate && files.certificate[0]) {
        const certificateUrl = await uploadToCloudinary(files.certificate[0].buffer, 'trainer_certificate');
        documents.certificateUrl = certificateUrl.secure_url;
      }
      


      // Now you have the URLs in the `documents` object
      const formData = {
        trainer_id,
        specialization,
        name,
        email,
        phone,
      };
  
      // Pass formData and document URLs to your service for KYC submission
      const kycStatus = await this.trainerService.kycSubmit(formData, documents);
  
      // Return success response with KYC status
      res.status(200).json({ message: 'KYC submitted successfully', kycStatus });
    } catch (error) {
      // Log and send error response
      console.error('Error in KYC submission:', error);
      res.status(500).json({
        message: 'Error in KYC submission',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
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

  async resubmitkyc(req: Request, res: Response) {
    try {
      const trainer_id = req.params.trainerId
      await this.trainerService.updateKycStatus(trainer_id)
      res.status(200).json({message: 'kyc updated'})
    } catch (error) {
      
    }
  }

  async getTrainer(req: Request, res: Response) {
    try {      
      const trainer_id = req.params.trainerId
      const trainerData = await this.trainerService.findTrainer(trainer_id)
      res.status(200).json({message: 'Trainer data fetch succeffully', trainerData: trainerData})
    } catch (error: any) {
      throw Error(error)
    }
  }

  async updateTrainer(req: Request, res: Response) {
    try {
      const trainer_id = req.params.trainerId;
      const trainerData = req.body; // This will include only the fields you want to update
  
      const updatedTrainer = await this.trainerService.updateTrainer(trainer_id, trainerData);
  
      res.status(200).json({ message: "Trainer updated successfully", updatedTrainer });
    } catch (error) {
      console.error("Error updating trainer:", error);
      res.status(500).json({ message: "Failed to update trainer" });
    }
  }
  
  async fetchRejectionReason(req: Request, res: Response) {
    try {
      const trainer_id = req.params.trainerId;
      const rejectionData = await this.trainerService.fetchRejectionData(trainer_id);
  
      // Extracting only the "reason" field
      const reason = rejectionData ? rejectionData.reason : null;
  
      res.status(200).json({
        message: 'Rejection reason fetched successfully',
        reason: reason, // Sending only the reason
      });
    } catch (error) {
      console.error('Error fetching rejection reason:', error);
      res.status(500).json({ message: 'Error fetching rejection reason' });
    }
  }

  async storeSessionData(req: Request, res: Response) {
    try {
      console.log('hit session traine controller');
      const { isSingleSession, selectedDate, startTime, startDate, endDate, endTime, price } = req.body;
console.log(isSingleSession, selectedDate, startTime, endTime, price );

      // try {
      //   if (isSingleSession) {
      //     // Handle single session
      //     const session = new Session({
      //       startDate: selectedDate,
      //       time: startTime,
      //       price,
      //       isSingleSession: true,
      //       // add other necessary fields
      //     });
      //     await session.save();
      //   } else {
      //     // Handle package session
      //     const session = new Session({
      //       startDate,
      //       endDate,
      //       time: endTime,
      //       price,
      //       isSingleSession: false,
      //       // add other necessary fields
      //     });
      //     await session.save();
      
    } catch (error) {
      
    }
  }
  

}

export default TrainerController;
