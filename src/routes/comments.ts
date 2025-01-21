import express, {Router} from "express";
import commentsController from "../controllers/comments-controller";
import {authMiddleware} from "../middlewares/authMiddleware";

const commentsRoutes: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments API
 */

/**
 * @swagger
 * paths:
 *   /comments/{id}:
 *     get:
 *       summary: Get all comments for a specific post by post ID
 *       description: Fetch all comments for a post identified by postId.
 *       tags:
 *         - Comments
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the post to retrieve comments for
 *           schema:
 *             type: string
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: List of comments for the post
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Comment'
 *         500:
 *           description: Error finding comments for the post
 */

/**
 * @swagger
 * paths:
 *   /comments/{postId}:
 *     post:
 *       summary: Add a new comment to a specific post
 *       description: Add a new comment to the post identified by postId.
 *       tags:
 *         - Comments
 *       parameters:
 *         - in: path
 *           name: postId
 *           required: true
 *           description: The ID of the post to add a comment to
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Comment added successfully
 *         500:
 *           description: Error adding comment to post
 */

/**
 * @swagger
 * paths:
 *   /comments/{postId}/{commentId}:
 *     put:
 *       summary: Update a comment in a specific post
 *       description: Update the content of an existing comment in a post identified by postId and commentId.
 *       tags:
 *         - Comments
 *       parameters:
 *         - in: path
 *           name: postId
 *           required: true
 *           description: The ID of the post the comment belongs to
 *           schema:
 *             type: string
 *         - in: path
 *           name: commentId
 *           required: true
 *           description: The ID of the comment to update
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   description: The new content for the comment
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Comment updated successfully
 *         500:
 *           description: Error updating comment
 */

/**
 * @swagger
 * paths:
 *   /comments/{postId}/{commentId}:
 *     delete:
 *       summary: Delete a comment in a post
 *       description: Delete a specific comment identified by commentId from the post identified by postId.
 *       tags:
 *         - Comments
 *       parameters:
 *         - in: path
 *           name: postId
 *           required: true
 *           description: The ID of the post the comment belongs to
 *           schema:
 *             type: string
 *         - in: path
 *           name: commentId
 *           required: true
 *           description: The ID of the comment to delete
 *           schema:
 *             type: string
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Comment deleted successfully
 *         500:
 *           description: Error deleting comment
 */

/**
 * @swagger
 * paths:
 *   /comments/{postId}/{commentId}:
 *     get:
 *       summary: Get a specific comment from a post by its ID
 *       description: Fetch a specific comment identified by commentId from the post identified by postId.
 *       tags:
 *         - Comments
 *       parameters:
 *         - in: path
 *           name: postId
 *           required: true
 *           description: The ID of the post the comment belongs to
 *           schema:
 *             type: string
 *         - in: path
 *           name: commentId
 *           required: true
 *           description: The ID of the comment to retrieve
 *           schema:
 *             type: string
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: The requested comment
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Comment'
 *         500:
 *           description: Error finding comment
 */

commentsRoutes.get("/:id", authMiddleware, commentsController.getCommentsById);
commentsRoutes.post("/:postId", authMiddleware, commentsController.addCommentToPost);
commentsRoutes.put("/:postId/:commentId", authMiddleware, commentsController.updateComment);
commentsRoutes.delete("/:postId/:commentId", authMiddleware, commentsController.deleteComment);
commentsRoutes.get("/:postId/:commentId", authMiddleware, commentsController.getSpecificComment);

export default commentsRoutes;
