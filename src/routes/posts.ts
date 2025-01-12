import express, {Router} from "express";
import postsController from "../controllers/posts-controller";

const postsRoutes: Router = express.Router();

postsRoutes.post("/", postsController.addPost);
postsRoutes.get("/all", postsController.getAllPosts);
postsRoutes.get("/:id", postsController.getPostById);
postsRoutes.get("/", postsController.getPostsBySenderId);
postsRoutes.put("/:id", postsController.updatePost);

export default postsRoutes;