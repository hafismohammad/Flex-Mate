import AdminModel from "../models/adminModel";

class AdminRepository {
  private adminModel = AdminModel;
  async findAdmin(email: string) {
    try {
      return await this.adminModel.findOne({ email });
    } catch (error) {
      console.log("Error finding user:", error);
      return null;
    }
  }
}

export default AdminRepository;
