// trainerController.ts

import { NextFunction, Request, Response } from "express";
import TrainerService from "../services/trainerServices";
import { ITrainer } from "../interface/trainer_interface";
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary";
import TrainerRepository from "../repositories/trainerRepository";
class TrainerController {
  private trainerService: TrainerService;

  constructor(trainerService: TrainerService) {
    this.trainerService = trainerService;
  }

  async getAllSpecializations(req: Request, res: Response, next: NextFunction) {
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
        next(error)
    }
  }

  async registerTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      const trainerData: ITrainer = req.body;

      const trainer = await this.trainerService.registerTrainer(trainerData);

      if (!trainer) {
        res.status(409).json({ message: "Email already exists" });
        return;
      }

      res.status(200).json({ message: "OTP sent to email" });
      return;
    } catch (error) {
      console.error("Error in registerTrainer:", error);
      if ((error as Error).message === "Email already exists") {
        res.status(409).json({ message: "Email already exists" });
        return;
      } else {
       
        next(error)
      }
    }
  }

  async verifyOtp(req: Request, res: Response, next:NextFunction) {
    try {
      const { trainerData, otp } = req.body;
// console.log('trainerData', trainerData.specializations);

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
        next(error)
      }
    }
  }
  // Resend OTP
  async resendOtp(
    req: Request<{ email: string }>,
    res: Response, next: NextFunction): Promise<void> {
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
       next(error)
      }
    }
  }

  // trainerController.ts
  async trainerLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      }
    } catch (error: any) {
      if (error.message === "Trainer is blocked") {
        res.status(403).json({ message: "Trainer is blocked" });
      } else if (error.message === "Invalid email or password") {
        res.status(401).json({ message: "Invalid email or password" });
      } else if (error.message === "Trainer not exists") {
        res.status(404).json({ message: "Trainer not found" });
      } else {
        console.log("Login controller:", error);
       next(error)
      }
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const trainer_refresh_token = req.cookies?.trainer_refresh_token;

    if (!trainer_refresh_token) {
      res.status(403).json({ message: "Refresh token not found" });
      return;
    }

    try {
      const newAccessToken = await this.trainerService.generateTokn(
        trainer_refresh_token
      );

      const TrainerNewAccessToken = Object.assign(
        {},
        { accessToken: newAccessToken }
      );

      // console.log('new token', TrainerNewAccessToken);

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error("Error generating new access token:", error);
      next(error)
    }
  }

  async kycSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { trainer_id, specialization, name, email, phone } = req.body;
  
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
      const formData = {
        trainer_id,
        specialization,
        name,
        email,
        phone,
      };
  
      // Pass formData and uploaded files to the service for KYC submission
      const kycStatus = await this.trainerService.kycSubmit(formData, files);
  
      // Return success response with KYC status
      res.status(200).json({ message: "KYC submitted successfully", kycStatus });
    } catch (error) {
      console.error("Error in KYC submission:", error);
      next(error);
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

  // async getAllKycStatus(req: Request, res: Response) {}

  async trainerKycStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const trainerId = req.params.trainerId;
      const kycStatus = await this.trainerService.kycStatus(trainerId);

      res.status(200).json({ kycStatus });
    } catch (error) {
      console.error("Error fetching trainer KYC status:", error);
      next(error)
    }
  }

  async resubmitkyc(req: Request, res: Response) {
    try {
      const trainer_id = req.params.trainerId;
      await this.trainerService.updateKycStatus(trainer_id);
      res.status(200).json({ message: "kyc updated" });
    } catch (error) {}
  }

  async getTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      const trainer_id = req.params.trainerId;
      const trainerData = await this.trainerService.findTrainer(trainer_id);
      res.status(200).json({
        trainerData: trainerData,
      });
    } catch (error: any) {
      next(error)
    }
  }

  async updateTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      const trainer_id = req.params.trainerId;
      const trainerData = req.body;
  
      const existingTrainerProfile = await this.trainerService.fetchTrainer(trainer_id)
      if(existingTrainerProfile) {
         await deleteFromCloudinary(existingTrainerProfile)
      }
      const documents: { [key: string]: string | undefined } = {};
  
      if (req.file) {
        const profileImageUrl = await uploadToCloudinary(
          req.file.buffer,
          "trainer_profileImage"
        );
        documents.profileImage = profileImageUrl.secure_url;
      }
  
      const updatedTrainerData = { ...trainerData, ...documents };
  
      const updatedTrainer = await this.trainerService.updateTrainer(
        trainer_id,
        updatedTrainerData
      );
  
      res.status(200).json({
        message: "Trainer updated successfully",
        updatedTrainer,
      });
    } catch (error) {
      console.error("Error updating trainer:", error);
      next(error);
    }
  }
  

  async fetchSpecialization(req: Request, res: Response, next: NextFunction) {
    try {
      const trainer_id = req.params.trainerId
      const specializations = await this.trainerService.fetchSpec(trainer_id)  
      console.log(specializations);
      
      res.status(200).json({specializations})    
    } catch (error) {
      console.error("Error fetchin trainer specializations:", error);
      next(error)
    }
  }

  async fetchRejectionReason(req: Request, res: Response, next: NextFunction) {
    try {
      const trainer_id = req.params.trainerId;
      const rejectionData = await this.trainerService.fetchRejectionData(
        trainer_id
      );

      const reason = rejectionData ? rejectionData.reason : null;

      res.status(200).json({
        message: "Rejection reason fetched successfully",
        reason: reason,
      });
    } catch (error) {
      console.error("Error fetching rejection reason:", error);
      next(error)
    }
  }

  async storeSessionData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        recurrenceOption,
        specId,
        isSingleSession,
        selectedDate,
        startTime,
        startDate,
        endDate,
        endTime,
        price,
      } = req.body;
      const trainerId = req.params.tranerId;
 
      

      const sessionData: any = {};

      if (isSingleSession) {
        sessionData.specializationId = specId;
        sessionData.isSingleSession = isSingleSession;
        sessionData.trainerId = trainerId;
        sessionData.startDate = selectedDate;
        sessionData.startTime = startTime;
        sessionData.endTime = endTime;
        sessionData.price = price;
      } else {
        sessionData.specializationId = specId;
        sessionData.isSingleSession = isSingleSession;
        sessionData.trainerId = trainerId;
        sessionData.startDate = startDate;
        sessionData.endDate = endDate;
        sessionData.startTime = startTime;
        sessionData.endTime = endTime;
        sessionData.price = price;
      }

      const createdSessionData = await this.trainerService.AddNewSession(
        sessionData,
        recurrenceOption
      );
      // console.log('createdSessionData----', createdSessionData);
      
      res
        .status(201)
        .json({ message: "Session created successfully.", createdSessionData });
    } catch (error: any) {
      if (error.message === "Time conflict with an existing session.") {
        res
          .status(400)
          .json({ message: "Time conflict with an existing session." });
      } else if (error.message.includes("Daily session limit")) {
        res.status(400).json({ message: error.message });
      } else if (error.message === "End time must be after start time") {
        res.status(400).json({ message: "End time must be after start time" });
      } else if (
        error.message === "Session duration must be at least 30 minutes"
      ) {
        res
          .status(400)
          .json({ message: "Session duration must be at least 30 minutes" });
      } else {
        console.error("Detailed server error:", error);
        next(error)
      }
    }
  }

  async getSessionSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const trainer_id = req.params.trainerId;
      const sheduleData = await this.trainerService.getSessionShedules(
        trainer_id
      );
      // console.log('sheduleData',sheduleData);

      res
        .status(200)
        .json({ message: "Session data feched sucessfully", sheduleData });
    } catch (error) {
      console.error("Error saving session data:", error);
     next(error)
    }
  }

  async deleteSessionSchedule(req: Request, res: Response) {
    let session_id = req.params.sessionId;
    // console.log(session_id);

    const deletedSchedule = await this.trainerService.deleteSession(session_id);
    res.status(200).json({
      message: "Session deleted successfully",
      deletedSchedule: deletedSchedule,
    });
  }

  async fetchBookingDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const trainer_id = req.params.trainerId;

      const bookingDetails = await this.trainerService.getBookingDetails(
        trainer_id
      );

      res.status(200).json(bookingDetails);
    } catch (error) {
      next(error)
    }
  }

  async fetchUser(req: Request, res: Response, next: NextFunction) {
    try {
      
      const userData = await this.trainerService.fetchUser(req.params.userId)
      res.status(200).json(userData)
    } catch (error) {
      next(error)
    }
  }

  // async sessionStatusChange(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const {bookingId} = req.params
  //     const newStatus = await this.trainerService.sessionStatusChange(bookingId)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  async gatWalletData(req: Request, res: Response, next: NextFunction) {
    try {
      const trinerId = req.params.trainerId
      const walletData = await this.trainerService.getWallet(trinerId)
      res.status(200).json(walletData)
    } catch (error) {
      next(error)
    }
  }

  async withdraw(req: Request, res: Response, next: NextFunction) {
   try {
    const {trainerId} = req.params
    const {amount} = req.body

    const withdrawed = await this.trainerService.withdraw(trainerId, amount)
    res.status(200).json(withdrawed)
   } catch (error) {
    next(error)
   }
  }

  async addPrescriptionInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const {bookingId} = req.params
      const prescriptions = req.body.data
      const prescriptionInfo = await this.trainerService.addPrescription(bookingId, prescriptions)
      console.log('prescriptionInfo',prescriptionInfo);
      res.status(200).json({message: 'Prescription sent successfully'})
    } catch (error) {
      next(error)
    }
  }
}

export default TrainerController;
