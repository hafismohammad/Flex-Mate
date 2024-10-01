import { IUser } from '../interface/userTypes';
import UserRepository from '../repositories/userRepository';

class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async register(userData: IUser): Promise<void> {
    try { 
      console.log('User service received data:', userData);
      const newUser: IUser = { ...userData };
      await this.userRepository.create(newUser);
    } catch (error) {
      console.error("Error in service:", (error as Error).message);
      throw new Error("Error in user service");
    }
  }
}

export default UserService;
