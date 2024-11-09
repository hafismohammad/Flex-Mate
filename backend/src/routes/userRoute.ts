import express from "express";
import UserRepository from "../repositories/userRepository";
import UserService from "../services/userService";
import UserController from "../controllers/userController";
import authMiddlewares from "../middlewares/authMiddlewares";
import upload from "../utils/multer";


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
router.post("/logout",  authMiddlewares(['user']), userController.logout.bind(userController));
router.get("/allTrainers",  userController.getAllTrainers.bind(userController))
router.get("/allspecializations",  userController.getAllspecializations.bind(userController))
router.get("/getTrainer/:trainerId",  userController.getTrainer.bind(userController))
router.get("/sessionSchedules", userController.getSessionSchedules.bind(userController))
router.post("/makePayment/:sessionId",  authMiddlewares(['user']), userController.checkoutPayment.bind(userController))
router.post("/createBooking",  authMiddlewares(['user']), userController.createBooking.bind(userController))
router.get('/getUser/:userId',  authMiddlewares(['user']), userController.getUser.bind(userController))
router.patch('/updateUser',  authMiddlewares(['user']), userController.updateUserData.bind(userController))
router.patch('/uploadProfileImage/:userId',  authMiddlewares(['user']), upload.single('profileImage'), userController.uploadProfileImage.bind(userController))
router.get('/bookings/:userId',  authMiddlewares(['user']), userController.getAllBookings.bind(userController))


export default router;
