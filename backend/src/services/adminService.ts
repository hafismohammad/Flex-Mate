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
}

export default AdminService;
