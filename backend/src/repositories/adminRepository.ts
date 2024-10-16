import AdminModel from "../models/adminModel";
import SpecializationModel from "../models/specializationModel";
import KYCModel from "../models/KYC_Model";
import TrainerModel from "../models/trainerModel";
import UserModel from "../models/userModel";

class AdminRepository {
  private adminModel = AdminModel;
  private specializationModel = SpecializationModel
  private kycModel = KYCModel
  private trainerModel = TrainerModel
  private userModel = UserModel
  async findAdmin(email: string) {
    try {
      return await this.adminModel.findOne({ email });
    } catch (error) {
      console.log("Error finding user:", error);
      return null;
    }
  }

  async addSpecialization({ name, description }: { name: string; description: string }) {
    try {
      return await this.specializationModel.create({ name, description });
    } catch (error) {
      console.log('Error adding specialization:', error);
      throw error; 
    }
  }

  async getAllTrainersKycDatas() {
    return this.trainerModel.aggregate([
      {
        $lookup: {
          from: this.kycModel.collection.name, 
          localField: '_id', 
          foreignField: 'trainerId', 
          as: 'kycData', 
        },
      },
      {
        $unwind: {
          path: '$kycData', 
          // preserveNullAndEmptyArrays: true, 
        },
      },
      {
        $project: {
          _id: 1,
          name: 1, 
          email: 1, 
          kycData: 1,
        },
      },
    ]);
  }

  async updateKycStatus(status: string, trainer_id: string): Promise<void> {
    try {
     
      const updatedTrainer = await this.trainerModel.findByIdAndUpdate(
        trainer_id,
        { kycStatus: status },
        { new: true, runValidators: true }
      );
  
      if (updatedTrainer) {
        console.log('Trainer KYC status updated successfully:', updatedTrainer);
  
        // Update the KYC status in the KYC model using the trainer_id
        const updatedKyc = await this.kycModel.findOneAndUpdate(
          { trainerId: trainer_id },
          { kycStatus: status },
          { new: true, runValidators: true }
        );
  
        if (updatedKyc) {
          console.log('KYC model status updated successfully:', updatedKyc);
        } else {
          console.log('KYC record not found for the given trainer ID:', trainer_id);
        }
      } else {
        console.log('Trainer not found with the given ID:', trainer_id);
      }
    } catch (error) {
      console.error('Error updating KYC status:', error);
    }
  }
  
  
  async getAllSpecializations() {
    return await this.specializationModel.find()
  }
  
  async updateSpecStatus(spec_id: string, status: boolean) {
    return await this.specializationModel.findByIdAndUpdate(
     { _id: spec_id},
     { isListed: status},
     { new: true } 
    )
  }

  async fetchAllUsers() {
    return await this.userModel.find()
  }

}

export default AdminRepository;
