import AdminModel from "../models/adminModel";
import SpecializationModel from "../models/specializationModel";

class AdminRepository {
  private adminModel = AdminModel;
  private specializationModel = SpecializationModel
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
  

}

export default AdminRepository;
