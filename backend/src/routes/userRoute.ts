import express from "express";
import UserRepository from "../repositories/userRepository";
import UserService from "../services/userService";
import UserController from "../controllers/userController";

const router = express.Router();

// Set up instances of the repository, service, and controller
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// POST /api/users/signup
router.post("/signup", (req, res) => userController.register(req, res));

export default router;
