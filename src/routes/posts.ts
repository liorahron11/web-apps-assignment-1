import express, {Router} from "express";
import postsController from "../controllers/posts-controller";
import {authMiddleware} from "../middlewares/authMiddleware";
const postsRoutes: Router = express.Router();

postsRoutes.post("/", authMiddleware,  postsController.addPost);
postsRoutes.get("/all", authMiddleware,postsController.getAllPosts);
postsRoutes.get("/:id", authMiddleware, postsController.getPostById);
postsRoutes.get("/", authMiddleware,postsController.getPostsBySenderId);
postsRoutes.put("/:id", authMiddleware, postsController.updatePost);

export default postsRoutes;