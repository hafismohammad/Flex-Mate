import express from 'express';
import upload from '../utils/multer';
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

const uploadTrainerDataFiles = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'aadhaarFrontSide', maxCount: 1 },
  { name: 'aadhaarBackSide', maxCount: 1 },
  { name: 'certificate', maxCount: 1 }
]);

// Bind the controller method to the route
router.get('/getSpecializations', trainerController.getAllSpecializations.bind(trainerController));
router.post('/signup', trainerController.registerTrainer.bind(trainerController))
router.post('/otp', trainerController.verifyOtp.bind(trainerController))
router.post('/resend-otp', trainerController.resendOtp.bind(trainerController))
router.post('/login', trainerController.trainerLogin.bind(trainerController))
router.post('/refresh-token', trainerController.refreshToken.bind(trainerController))
router.post('/kyc', authMiddlewares(['trainer']), uploadTrainerDataFiles, trainerController.kycSubmission.bind(trainerController));
router.post('/logout',  authMiddlewares(['trainer']), trainerController.logoutTrainer.bind(trainerController))
router.get('/kycStatus/:trainerId',  authMiddlewares(['trainer']), trainerController.trainerKycStatus.bind(trainerController));
router.put('/resubmitKyc/:trainerId',  authMiddlewares(['trainer']), trainerController.resubmitkyc.bind(trainerController))
router.get('/getTrainer/:trainerId',  authMiddlewares(['trainer']), trainerController.getTrainer.bind(trainerController))
router.patch(`/updateTrainerData/:trainerId`,  authMiddlewares(['trainer']), upload.single('profileImage'),  trainerController.updateTrainer.bind(trainerController))
router.get('/fetchSecializations/:trainerId',  authMiddlewares(['trainer']), trainerController.fetchSpecialization.bind(trainerController))
router.get('/rejectionReason/:trainerId',  authMiddlewares(['trainer']), trainerController.fetchRejectionReason.bind(trainerController))
router.post('/session/:tranerId',  authMiddlewares(['trainer']), trainerController.storeSessionData.bind(trainerController))
router.get('/sessiosShedules/:trainerId',  authMiddlewares(['trainer']), trainerController.getSessionSchedules.bind(trainerController))
router.delete('/deleteSessionSchedule/:sessionId',  authMiddlewares(['trainer']), trainerController.deleteSessionSchedule.bind(trainerController))
router.get('/bookingDetails/:trainerId',  authMiddlewares(['trainer']), trainerController.fetchBookingDetails.bind(trainerController))




export default router;
