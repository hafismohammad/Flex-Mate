import { Request, Response } from "express";
import UserService from "../services/userService";
import { IUser } from "../interface/userTypes";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: Request, res: Response) {
    try {
     
      const userData: IUser = req.body
      
      await this.userService.register(userData);
      res.status(200).send("User registered successfully");
    } catch (error) {
      console.log("Controller error:", error);
      res.status(400).json({ message: "Something went wrong, please try again later" });
    }
  }
}

export default UserController;
