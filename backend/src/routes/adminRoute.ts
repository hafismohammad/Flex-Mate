import express from 'express';
import AdminController from '../controllers/adminController';
import AdminService from '../services/adminService';
import AdminRepository from '../repositories/adminRepository';

const router = express.Router();

// Instantiate the repository, service, and controller in the correct order
const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

router.post('/adminLogin', adminController.adminLogin.bind(adminController));
router.post('/logout', adminController.adminLogout.bind(adminController))
router.post('/addSpecialization', adminController.addSpecialization.bind(adminController))
router.get('/allTrainerKyc', adminController.getAllTrainersKycDatas.bind(adminController))
router.get('/trainerKycDetails/:trainer_id', adminController.allTrainersKycData.bind(adminController));
router.patch('/updateKycStatus/:trainer_id', adminController.changeKycStatus.bind(adminController));





export default router;
