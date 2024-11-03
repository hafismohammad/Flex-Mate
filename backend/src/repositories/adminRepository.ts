import AdminModel from "../models/adminModel";
import SpecializationModel from "../models/specializationModel";
import KYCModel from "../models/KYC_Model";
import TrainerModel from "../models/trainerModel";
import UserModel from "../models/userModel";
import KycRejectionReasonModel from "../models/kycRejectionReason";

class AdminRepository {
  private adminModel = AdminModel;
  private specializationModel = SpecializationModel
  private kycModel = KYCModel
  private trainerModel = TrainerModel
  private userModel = UserModel
  private kycRejectionReasonModel = KycRejectionReasonModel

  async findAdmin(email: string) {
    try {
      return await this.adminModel.findOne({ email });
    } catch (error) {
      console.log("Error finding user:", error);
      return null;
    }
  }

  async addSpecialization({ name, description, image }: { name: string; description: string; image: string | null }) {
    try {
        // Include the image in the data being inserted into the database
        return await this.specializationModel.create({ name, description, image });
    } catch (error) {
        console.log('Error adding specialization:', error);
        throw error;
    }
}


  async getAllTrainersKycDatas() {
    return await this.trainerModel.aggregate([
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

  async fetchKycData(trainerId: string) {
    try {
      return await KYCModel.findOne({ trainerId }).populate('specializationId').populate('trainerId')
       
    } catch (error) {
      console.error('Error fetching KYC data:', error);
      throw new Error('Failed to fetch KYC data');
    }
  }
  
  
  
  

  async updateKycStatus(status: string, trainer_id: string, rejectionReason: string | null): Promise<any> {
    try {
      const updatedTrainer = await this.trainerModel.findByIdAndUpdate(
        trainer_id,
        { kycStatus: status },
        { new: true, runValidators: true }
      );
  
      if (updatedTrainer) {
        console.log('Trainer KYC status updated successfully:', updatedTrainer);
  
        const updatedKyc = await this.kycModel.findOneAndUpdate(
          { trainerId: trainer_id },
          { kycStatus: status },
          { new: true, runValidators: true }
        );
  
        if (updatedKyc) {
          console.log('KYC model status updated successfully:', updatedKyc);
  
          // Save the rejection reason if the status is 'rejected'
          if (status === 'rejected' && rejectionReason) {
            await this.kycRejectionReasonModel.create({
              trainerId: trainer_id,
              reason: rejectionReason,
            });
            console.log('Rejection reason saved successfully.');
          }
  
          return updatedKyc;
        } else {
          console.log('KYC record not found for the given trainer ID:', trainer_id);
          return null;
        }
      } else {
        console.log('Trainer not found with the given ID:', trainer_id);
        return null;
      }
    } catch (error) {
      console.error('Error updating KYC status:', error);
      throw error;
    }
  }
  

  async deleteKyc(trainer_id: string) {
    try {
      console.log('-------------------------->',trainer_id);
      
      const result = await this.kycModel.findOneAndDelete({ trainerId: trainer_id });
      if (result) {
        console.log('KYC record deleted successfully:', result);
      } else {
        console.log('No KYC record found for deletion with trainer ID:', trainer_id);
      }
    } catch (error) {
      console.error('Error deleting KYC record:', error);
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
  async fetchAllTrainer() {
    return await this.trainerModel.find().populate('specialization')
  }
  async updateUserStatus(user_id: string, userStatus: boolean) {
    // console.log(user_id, userStatus);
    
   return  await this.userModel.findByIdAndUpdate(
      {_id: user_id},
      {isBlocked: userStatus},
      { new: true } 
    )
    
  }

  async updateTrainerStatus(trainer_id: string, trainerStatus: boolean) {
    
   return  await this.trainerModel.findByIdAndUpdate(
      {_id: trainer_id},
      {isBlocked: trainerStatus},
      { new: true } 
    )
    
  }

  async saveRejectionReason(trainerId: string, reason: string): Promise<void> {
    try {
      await KycRejectionReasonModel.create({
        trainerId: trainerId,
        reason: reason,
        date: new Date(),
      });
      console.log('Rejection reason saved successfully for trainer ID:', trainerId);
    } catch (error) {
      console.error('Error saving rejection reason:', error);
      throw error;
    }
  }
}


export default AdminRepository;
