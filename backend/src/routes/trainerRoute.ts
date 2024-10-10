// trainerRoutes.js

import express from 'express';
import TrainerController from '../controllers/trainerController';
import TrainerService from '../services/trainerServices';
import TrainerRepository from '../repositories/trainerRepository';

const router = express.Router();

// Instantiate the repository, service, and controller in the correct order
const trainerRepository = new TrainerRepository();
const trainerService = new TrainerService(trainerRepository);
const trainerController = new TrainerController(trainerService);

// Bind the controller method to the route
router.get('/getSpecializations', trainerController.getAllSpecializations.bind(trainerController));
router.post('/signup', trainerController.registerTrainer.bind(trainerController))

export default router;
