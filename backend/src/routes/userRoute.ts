import express from "express";
import UserRepository from "../repositories/userRepository";
import UserService from "../services/userService";
import UserController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddlewares";

const router = express.Router();

// Set up instances of the repository, service, and controller
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post("/signup", userController.register.bind(userController));
router.post("/otp", userController.verifyOtp.bind(userController));
router.post("/resend-otp", userController.resendOtp.bind(userController));
router.post("/login", userController.login.bind(userController));
router.post('/refresh-token', userController.refreshToken.bind(userController))
router.post("/logout", authMiddleware, userController.logout.bind(userController));
router.get("/allTrainers", authMiddleware, userController.getAllTrainers.bind(userController))
router.get("/allspecializations", authMiddleware, userController.getAllspecializations.bind(userController))
router.get("/getTrainer/:trainerId", authMiddleware, userController.getTrainer.bind(userController))
router.get("/sessionSchedules", authMiddleware, userController.getSessionSchedules.bind(userController))
router.post("/makePayment/:sessionId", authMiddleware, userController.checkoutPayment.bind(userController))

export default router;
