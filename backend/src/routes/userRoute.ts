import express from "express";
import UserRepository from "../repositories/userRepository";
import UserService from "../services/userService";
import UserController from "../controllers/userController";

const router = express.Router();

// Set up instances of the repository, service, and controller
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post("/signup", userController.register.bind(userController));
router.post("/otp", userController.verifyOtp.bind(userController));
router.post("/resend-otp", userController.resendOtp.bind(userController));
router.post("/login", userController.login.bind(userController));
router.post("/logout", userController.logout.bind(userController));

export default router;
