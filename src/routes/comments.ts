import express, {Router} from "express";
import commentsController from "../controllers/comments-controller";


const commentsRoutes: Router = express.Router();

commentsRoutes.get("/:id", commentsController.getCommentsById);
commentsRoutes.post("/:postId", commentsController.addCommentToPost);
commentsRoutes.put("/:postId/:commentId", commentsController.updateComment);
commentsRoutes.delete("/:postId/:commentId", commentsController.deleteComment);
commentsRoutes.get("/:postId/:commentId", commentsController.getSpecificComment);

export default commentsRoutes;
