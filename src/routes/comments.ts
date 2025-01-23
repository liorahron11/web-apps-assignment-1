import express, {Router} from "express";
import commentsController from "../controllers/comments-controller";
import {authMiddleware} from "../middlewares/authMiddleware";

const commentsRoutes: Router = express.Router();

commentsRoutes.get("/:id", authMiddleware, commentsController.getCommentsById);
commentsRoutes.post("/:postId", authMiddleware, commentsController.addCommentToPost);
commentsRoutes.put("/:postId/:commentId", authMiddleware, commentsController.updateComment);
commentsRoutes.delete("/:postId/:commentId", authMiddleware, commentsController.deleteComment);
commentsRoutes.get("/:postId/:commentId", authMiddleware, commentsController.getSpecificComment);

export default commentsRoutes;
