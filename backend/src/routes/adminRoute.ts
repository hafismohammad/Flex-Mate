import express from 'express';
import AdminController from '../controllers/adminController';
import AdminService from '../services/adminService';
import AdminRepository from '../repositories/adminRepository';
import upload from '../utils/multer';
import authMiddleware from '../middlewares/authMiddlewares';
const router = express.Router();

// Instantiate the repository, service, and controller in the correct order
const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

router.post('/adminLogin', adminController.adminLogin.bind(adminController));
router.post('/refresh-token', adminController.refreshToken.bind(adminController))
router.post('/logout',  authMiddleware(['admin']), adminController.adminLogout.bind(adminController))
router.post('/addSpecialization', authMiddleware(['admin']), upload.single('image'), adminController.addSpecialization.bind(adminController))
router.get('/allTrainerKyc', authMiddleware(['admin']), adminController.getAllTrainersKycDatas.bind(adminController))
router.get('/trainerKycDetails/:trainer_id', authMiddleware(['admin']), adminController.trainersKycData.bind(adminController));
router.patch('/updateKycStatus/:trainer_id', authMiddleware(['admin']), adminController.changeKycStatus.bind(adminController));
router.get('/allSpecializations', authMiddleware(['admin']), adminController.getAllSpecializations.bind(adminController))
router.patch('/toggle-status/:spec_id', authMiddleware(['admin']), adminController.updateStatus.bind(adminController))
router.get('/allUsers', authMiddleware(['admin']), adminController.getAllUsers.bind(adminController))
router.get('/allTrainer', authMiddleware(['admin']), adminController.getAllTrainer.bind(adminController))
router.patch('/user-block-unblock/:user_id', authMiddleware(['admin']), adminController.blockUnblockUser.bind(adminController))
router.patch('/trainer-block-unblock/:trainer_id', authMiddleware(['admin']), adminController.blockUnblockTrainer.bind(adminController))








export default router;
