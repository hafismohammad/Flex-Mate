import express from 'express';
import uploads from '../utils/multer';
import authMiddlewares from '../middlewares/authMiddlewares'

import TrainerController from '../controllers/trainerController';
import TrainerService from '../services/trainerServices';
import TrainerRepository from '../repositories/trainerRepository';
import AdminController from '../controllers/adminController';

const router = express.Router();

// Instantiate the repository, service, and controller in the correct order
const trainerRepository = new TrainerRepository();
const trainerService = new TrainerService(trainerRepository);
const trainerController = new TrainerController(trainerService);

// Bind the controller method to the route
router.get('/getSpecializations', trainerController.getAllSpecializations.bind(trainerController));
router.post('/signup', trainerController.registerTrainer.bind(trainerController))
router.post('/otp', trainerController.verifyOtp.bind(trainerController))
router.post('/resend-otp', trainerController.resendOtp.bind(trainerController))
router.post('/login', trainerController.trainerLogin.bind(trainerController))
router.post('/refresh-token', trainerController.refreshToken.bind(trainerController))
router.post('/kyc', authMiddlewares, uploads.fields([{ name: 'document1', maxCount: 1 }, { name: 'document2', maxCount: 1 }]),trainerController.kycSubmission.bind(trainerController));
router.post('/logout' , authMiddlewares, trainerController.logoutTrainer.bind(trainerController))
router.get('/getKycStatus', trainerController.getAllKycStatus.bind(trainerController))
router.get('/kycStatus/:trainerId', authMiddlewares,trainerController.trainerKycStatus.bind(trainerController));
router.put('/resubmitKyc/:trainerId', authMiddlewares, trainerController.resubmitkyc.bind(trainerController))
router.get('/getTrainer/:trainerId', authMiddlewares, trainerController.getTrainer.bind(trainerController))
router.patch(`/updateTrainerData/:trainerId`, authMiddlewares, trainerController.updateTrainer.bind(trainerController))




export default router;
