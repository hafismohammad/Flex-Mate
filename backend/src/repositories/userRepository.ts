import { IUser } from '../interface/userTypes';
import UserModel from '../models/userModel';

class UserRepository {
  async create(userData: IUser): Promise<IUser> {
    try {
      console.log("Attempting to create user:", userData);
      const user = new UserModel(userData);
      return await user.save();
    } catch (error) {
      console.error("Error during user creation:", (error as Error).message);
      throw new Error("Error creating user");
    }
  }
}

export default UserRepository;
