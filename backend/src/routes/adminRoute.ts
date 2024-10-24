import express from 'express';
import AdminController from '../controllers/adminController';
import AdminService from '../services/adminService';
import AdminRepository from '../repositories/adminRepository';
import upload from '../utils/multer';
const router = express.Router();

// Instantiate the repository, service, and controller in the correct order
const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

router.post('/adminLogin', adminController.adminLogin.bind(adminController));
router.post('/logout', adminController.adminLogout.bind(adminController))
router.post('/addSpecialization', upload.single('image'), adminController.addSpecialization.bind(adminController))
router.get('/allTrainerKyc', adminController.getAllTrainersKycDatas.bind(adminController))
router.get('/trainerKycDetails/:trainer_id', adminController.trainersKycData.bind(adminController));
router.patch('/updateKycStatus/:trainer_id', adminController.changeKycStatus.bind(adminController));
router.get('/allSpecializations',  adminController.getAllSpecializations.bind(adminController))
router.patch('/toggle-status/:spec_id', adminController.updateStatus.bind(adminController))
router.get('/allUsers', adminController.getAllUsers.bind(adminController))
router.get('/allTrainer', adminController.getAllTrainer.bind(adminController))
router.patch('/user-block-unblock/:user_id', adminController.blockUnblockUser.bind(adminController))
router.patch('/trainer-block-unblock/:trainer_id', adminController.blockUnblockTrainer.bind(adminController))








export default router;
