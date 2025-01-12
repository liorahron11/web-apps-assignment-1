import express, {Router} from "express";
import authController from "../controllers/auth-controller";


const authRoutes: Router = express.Router();


authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/refresh", authController.refresh);
authRoutes.post("/logout", authController.logout);

export default authRoutes;
