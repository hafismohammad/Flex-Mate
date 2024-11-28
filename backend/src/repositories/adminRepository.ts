import AdminModel from "../models/adminModel";
import SpecializationModel from "../models/specializationModel";
import KYCModel from "../models/KYC_Model";
import TrainerModel from "../models/trainerModel";
import UserModel from "../models/userModel";
import KycRejectionReasonModel from "../models/kycRejectionReason";
import BookingModel from "../models/booking";

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
      const kycData = await KYCModel.findOne({ trainerId }).populate('specializationId').populate('trainerId')
     
      
      return kycData
       
    } catch (error) {
      console.error('Error fetching KYC data:', error);
      throw new Error('Failed to fetch KYC data');
    }
  }
  

  async updateKycStatus(status: string, trainer_id: string, rejectionReason: string | null): Promise<any> {
    try {
      console.log('update kyc status repo', rejectionReason);
      
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
           const reason =  await this.kycRejectionReasonModel.create({
              trainerId: trainer_id,
              reason: rejectionReason,
            });
            console.log('Rejection reason saved successfully.');
            const response = {
              trainerMail : updatedTrainer.email,
              reason: reason.reason
            }
            return response
          } 

          if(status === 'approved') {
            console.log('approve hit with',updatedTrainer.email);
            
            if(updatedTrainer.email) {
              return updatedTrainer.email
            }
          }
          
  
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
    
    const trainers =  await this.trainerModel.find().populate('specializations')
    console.log('trainers', trainers);
    
    return trainers
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
      console.log('save rejection reasonr');
      
       await this.kycRejectionReasonModel.create({
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

  async fetchAllBookings() {
    try {
      const allBookings = await BookingModel.aggregate([
        {
          $lookup: {
            from: 'trainers',
            localField: 'trainerId',
            foreignField: '_id',
            as: 'trainerDetails'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        {
          $lookup: {
            from: 'sessions',
            localField: 'sessionId',
            foreignField: '_id',
            as: 'sessionDetails'
          }
        },
        {
          $lookup: {
            from: 'specializations',
            localField: 'specializationId',
            foreignField: '_id',
            as: 'specializationDetails'
          }
        },
        {
          $unwind: {
            path: "$trainerDetails",
            preserveNullAndEmptyArrays: true 
          }
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true 
          }
        },
        {
          $unwind: {
            path: "$sessionDetails",
            preserveNullAndEmptyArrays: true 
          }
        }, {
          $unwind: {
            path: "$specializationDetails",
            preserveNullAndEmptyArrays: true 
          }
        },
        {
          $project: {
            bookingId: '$_d',
            userName: '$userDetails.name',
            trainerName: '$trainerDetails.name',
            bookingDate: '$bookingDate',
            sessionDates: {
              $cond: {
                if: {$eq: ["$sessionDetails.isSingleSession", true]},
                then: {
                  startDate: { $ifNull: ["$sessionDetails.startDate", null] },
                },  else: {
                  startDate: { $ifNull: ["$sessionDetails.startDate", null] },
                  endDate: { $ifNull: ["$sessionDetails.endDate", null] },
                },
              }
            },
            sessionStartTime: "$startTime",
            sessionEndTime: '$endTime',
            sessionType: '$sessionType',
            specialization: '$specialization',
            amount: '$amount',
            status: '$paymentStatus'
          }
        }
      ])
// console.log(allBookings);

      return allBookings
    } catch (error) {
      console.error('Error fetching all booking details:', error);
      throw error;
    }
  }
}


export default AdminRepository;
