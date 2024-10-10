// trainerController.ts

import { Request, Response } from "express";
import TrainerService from "../services/trainerServices";
import { ITrainer } from "../interface/trainer_interface";

class TrainerController {
    private trainerService: TrainerService; 

    constructor(trainerService: TrainerService) {
        this.trainerService = trainerService; 
    }

    async getAllSpecializations(req: Request, res: Response) {
        try {
            const specializationsData = await this.trainerService.findAllSpecializations();
            
            res.status(200).json({ success: true, data: specializationsData });
        } catch (error) {
            console.error('Error in controller while fetching specializations:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch specializations' });
        }
    }

    async registerTrainer(req: Request, res: Response) {
        try {
            const trainerData: ITrainer = req.body
            await this.trainerService.registerTrainer(trainerData)
        } catch (error) {
            
        }
    }
}

export default TrainerController;
