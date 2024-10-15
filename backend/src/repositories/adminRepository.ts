import AdminModel from "../models/adminModel";
import SpecializationModel from "../models/specializationModel";
import KYCModel from "../models/KYC_Model";
import TrainerModel from "../models/trainerModel";

class AdminRepository {
  private adminModel = AdminModel;
  private specializationModel = SpecializationModel
  private kycModel = KYCModel
  private trainerModel = TrainerModel
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
        console.log('KYC status updated successfully for trainer:', updatedTrainer);
      } else {
        console.log('Trainer not found with the given ID:', trainer_id);
      }
    } catch (error) {
      console.error('Error updating KYC status:', error);
    }
  }
  
  
  

}

export default AdminRepository;
