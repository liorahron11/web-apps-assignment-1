import express, {Router} from "express";
import postsController from "../controllers/posts-controller";
import {authMiddleware} from "../middlewares/authMiddleware";
const postsRoutes: Router = express.Router();


/**
* @swagger
* tags:
*   name: Posts
*   description: The Posts API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique ID of the comment
 *         senderId:
 *           type: string
 *           description: The ID of the sender of the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique ID of the post
 *         senderId:
 *           type: string
 *           description: The ID of the sender of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: List of comments associated with the post
 */



/**
 * @swagger
 * paths:
 *   /posts:
 *     post:
 *       summary: Add a new post
 *       description: Create a new post with the provided content.
 *       tags:
 *         - Posts
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       responses:
 *         201:
 *           description: Post added successfully
 *         500:
 *           description: Error adding post
 */
postsRoutes.post("/", authMiddleware,  postsController.addPost);


/**
 * @swagger
 * paths:
 *   /posts/all:
 *     get:
 *       summary: Get all posts
 *       description: Fetch all posts from the system.
 *       tags:
 *         - Posts
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: List of all posts
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Post'
 *         500:
 *           description: Error fetching posts
 */
postsRoutes.get("/all", authMiddleware,postsController.getAllPosts);


/**
 * @swagger
 * paths:
 *   /posts/{id}:
 *     get:
 *       summary: Get a specific post by ID
 *       description: Fetch a post by its ID.
 *       tags:
 *         - Posts
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the post
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: The requested post
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Post'
 *         500:
 *           description: Error finding post
 */
postsRoutes.get("/:id", authMiddleware, postsController.getPostById);

/**
 * @swagger
 * paths:
 *   /posts:
 *     get:
 *       summary: Get posts by sender ID
 *       description: Fetch posts sent by a specific sender.
 *       tags:
 *         - Posts
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: sender
 *           required: true
 *           description: The sender's ID
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: List of posts from the sender
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Post'
 *         500:
 *           description: Error finding posts
 */
postsRoutes.get("/", authMiddleware,postsController.getPostsBySenderId);

/**
 * @swagger
 * paths:
 *   /posts/{id}:
 *     put:
 *       summary: Update an existing post
 *       description: Update the content of an existing post by its ID.
 *       tags:
 *         - Posts
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the post to update
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
 *                   description: The new content for the post
 *       responses:
 *         200:
 *           description: Post updated successfully
 *         500:
 *           description: Error updating post
 */

postsRoutes.put("/:id", authMiddleware, postsController.updatePost);

export default postsRoutes;


