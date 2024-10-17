import { Request, Response } from "express";
import AdminService from "../services/adminService";
import { ILoginAdmin } from "../interface/admin_interface";
import { json } from "stream/consumers";

class AdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  async adminLogin(req: Request, res: Response) {
    try {
      const { email, password }: ILoginAdmin = req.body;
      // console.log("admin data", email, password);

      const admin = await this.adminService.adminLogin({ email, password });
      if (admin) {
        const { accessToken, refreshToken } = admin;
        res.cookie("admin_refresh_token", refreshToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        console.log("Admin authenticated successfully");
        res
          .status(200)
          .json({
            message: "Login successful",
            admin: admin.admin,
            token: accessToken,
          });
      } else {
        console.log("Admin authentication failed");
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async adminLogout(req: Request, res: Response) {
    try {
      res.clearCookie("admin_refresh_token", {
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

  async addSpecialization(req: Request, res: Response) {
    try {
      const specializationData = req.body;
      const specialization = await this.adminService.addSpecialization(specializationData);
      
      res.status(201).json({ message: "Specialization added successfully", specialization });
    } catch (error) {
      console.error('Adding specialization error', error);
      res.status(500).json({ message: "Failed to add specialization", error });
    }
  }
  
  async getAllTrainersKycDatas(req: Request, res: Response) {
    try {
      
      const allTrainersKycData = await this.adminService.TraienrsKycData();
      console.log(allTrainersKycData);
      
      res.status(200).json({ message: "Trainers KYC data fetched successfully", data: allTrainersKycData });
    } catch (error) {
      console.error("Error fetching KYC data:", error);
      res.status(500).json({ message: "Failed to fetch KYC data", error });
    }
  }
  
async allTrainersKycData(req: Request, res: Response): Promise<void> {
  try {
    const trainerId = req.params.trainer_id; 
    const trainerKycDetails = await this.adminService.fetchKycData(trainerId);
    console.log('Trainer KYC Details:', trainerKycDetails);

    res.status(200).json({ message: 'Trainer KYC data fetched successfully', kycData: trainerKycDetails });
  } catch (error) {
    console.error("Error fetching KYC data:", error);
    res.status(500).json({ message: "Failed to fetch KYC data", error });
  }
}

async changeKycStatus(req: Request, res: Response) {
  try {
    const status = String(req.body.status); 
    const trainer_id = req.params.trainer_id; 
    
    console.log('Status:', status); 
    console.log('Trainer ID:', trainer_id); 

    await this.adminService.updateKycStatus(status, trainer_id);

    res.status(200).json({ message: 'Trainer status updated successfully', status });
  } catch (error) {
    console.error('Error updating trainer status:', error);
    res.status(500).json({ message: 'Failed to update trainer status' });
  }
}

async getAllSpecializations(req: Request, res: Response) {
  try {
    const allSpecializations = await this.adminService.getAllSpecializations(); 
    
    res.status(200).json(allSpecializations); 
  } catch (error) {
    console.error('Error fetching specializations:', error);
    res.status(500).json({ message: 'An error occurred while fetching specializations.' });
  }
}

async updateStatus(req: Request, res: Response) {
  try {
    const spec_id = req.params.spec_id;
    const status = req.body.isListed;

    const updateResult = await this.adminService.updateSpecStatus(spec_id, status);

    res.status(200).json({
      message: 'Specialization status updated successfully.',
      data: updateResult, 
    });
  } catch (error) {
    console.error('Error updating specializations status:', error);

    res.status(500).json({ message: 'An error occurred while updating specializations status.' });
  }
}

async getAllUsers(req: Request, res: Response) {
  try {
   const  allUsers =  await this.adminService.fetchAllUsers()
    res.status(200).json({message: 'Fetch all users successfully', users: allUsers})
  } catch (error) {
    
  }
}
async getAllTrainer(req: Request, res: Response) {
  try {
   const  allTrainer =  await this.adminService.fetchAllTrainer()
    res.status(200).json({message: 'Fetch all trainer successfully', trainer: allTrainer})
  } catch (error) {
    
  }
}

async blockUnblockUser(req: Request, res: Response) {
  try {
    const user_id = req.params.user_id
    const userStatus = req.body.status
    // console.log('sta--', userStatus);
    
    const status = await this.adminService.updateUserStatus(user_id, userStatus)
     res.status(200).json({
      message: 'user status updated sucessfully',
      data: status, 
    });   
  } catch (error) {
    
  }
}

async blockUnblockTrainer(req: Request, res: Response) {
  try {
    
    const trainer_id = req.params.trainer_id
    const trainerStatus = req.body.status
    console.log(trainer_id,trainerStatus);
    
    const status = await this.adminService.updateTrainerStatus(trainer_id, trainerStatus)
    
     res.status(200).json({
      message: 'trainer status updated sucessfully',
      data: status, 
    });   
  } catch (error) {
    
  }
}

}

export default AdminController;
