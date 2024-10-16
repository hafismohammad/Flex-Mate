import AdminRepository from "../repositories/adminRepository";
import {generateAccessToken, generateRefreshToken} from '../utils/jwtHelper'

class AdminService {
  private adminRepository: AdminRepository;

  constructor(adminRepository: AdminRepository) {

    this.adminRepository = adminRepository;
  }

  async adminLogin({ email, password }: { email: string; password: string }) {
    try {
      const adminData = await this.adminRepository.findAdmin(email);
      if (adminData) {
        if(adminData.password !== password) {
         throw Error('Password is wrong')    
        }
            // Generate access and refresh tokens
            const accessToken = generateAccessToken({ id: adminData._id.toString(), email: adminData.email });
            const refreshToken = generateRefreshToken({ id: adminData._id.toString(), email: adminData.email });
            return {
                accessToken,
                refreshToken,
                admin: {
                    id: adminData._id.toString(),
                    email: adminData.email,
                    password: adminData.password
                }
            }
      } else console.log("admin not exists");
    } catch (error) {
      console.error("Error in admin login:", error);
      throw error;
    }
  }

  async addSpecialization({name, description}: {name: string, description: string}) {
    const specializationData = await this.adminRepository.addSpecialization({name, description})
    return specializationData
  }

  async TraienrsKycData() {
    try {
      const allTrainersKycDatas = await this.adminRepository.getAllTrainersKycDatas();
      console.log('allTrainersKycDatas',allTrainersKycDatas);
      
      return allTrainersKycDatas; 
    } catch (error) {
      console.error("Error fetching trainers KYC data:", error);
      throw error; 
    }
  }
  
  async updateKycStatus(status: string, trainer_id: string): Promise<void> {
    try {
      await this.adminRepository.updateKycStatus(status, trainer_id);
    } catch (error) {
      console.error('Error updating KYC status:', error);
    }
  }

  async getAllSpecializations() {
    const specializations = await this.adminRepository.getAllSpecializations()    
    return specializations
  }

  async updateSpecStatus(spec_id: string, status: boolean) {
    return await this.adminRepository.updateSpecStatus(spec_id, status)
  }
  
  async fetchAllUsers() {
    return await this.adminRepository.fetchAllUsers()
  }

}

export default AdminService;
