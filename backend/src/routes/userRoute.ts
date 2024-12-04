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
router.get("/trainers",  userController.getAllTrainers.bind(userController))
router.get("/specializations",  userController.getAllspecializations.bind(userController))
router.get("/trainers/:trainerId",  userController.getTrainer.bind(userController))
router.get("/schedules", userController.getSessionSchedules.bind(userController))
router.post("/payment/:sessionId",  authMiddlewares(['user']), userController.checkoutPayment.bind(userController))
router.post("/bookings",  authMiddlewares(['user']), userController.createBooking.bind(userController))
router.get('/users/:userId',  authMiddlewares(['user']), userController.getUser.bind(userController))
router.patch('/users',  authMiddlewares(['user']), userController.updateUserData.bind(userController))
router.patch('/profile-image/:userId',  authMiddlewares(['user']), upload.single('profileImage'), userController.uploadProfileImage.bind(userController))
router.get('/bookings-details/:userId',  authMiddlewares(['user']), userController.getAllBookings.bind(userController))
router.patch('/cancel-booking/:bookingId', userController.cancelBooking.bind(userController))
router.post('/review', authMiddlewares(['user']), userController.addReview.bind(userController))
router.get('/reviews/:trainerId', authMiddlewares(['user']), userController.getReivew.bind(userController))
router.get('/reviews-summary/:trainerId', authMiddlewares(['user']), userController.getReivewSummary.bind(userController))
router.get('/bookings/:userId/:trainerId', authMiddlewares(['user']), userController.findbookings.bind(userController))
router.patch('/edit-review', authMiddlewares(['user']), userController.editReview.bind(userController))
router.get('/notifications/:userId', authMiddlewares(['user']), userController.getNotifications.bind(userController))
router.delete('/clear-notifications/:userId', authMiddlewares(['user']), userController.clearNotifications.bind(userController))
router.patch('/reset-password/:userId', authMiddlewares(['user']), userController.resetPassword.bind(userController))


export default router;
