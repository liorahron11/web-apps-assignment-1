import express, {Router} from "express";
import authController from "../controllers/auth-controller";
import {authMiddleware} from "../middlewares/authMiddleware";

const authRoutes: Router = express.Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/refresh",authMiddleware, authController.refresh);
authRoutes.post("/logout", authMiddleware, authController.logout);

export default authRoutes;
