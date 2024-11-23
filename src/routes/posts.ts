import express, {Router} from "express";
import {addPost, getAllPosts, getPostById} from "../queries/post-queries";
import {HydratedDocument} from "mongoose";
import {IPost} from "../interfaces/post.interface";
import { IComment } from "../interfaces/comment.interface";
const postsRoutes: Router = express.Router();

postsRoutes.put('/', async (req, res) => {
    const post: IPost = req.body.post;

    if (post) {
        const isPostAdded: boolean = await addPost(post);

        if (isPostAdded) {
            res.status(200).send('post added');
        } else {
            res.status(500).send('error adding post');
        }
    } else {
        res.status(500).send('post is missing');
    }
});

postsRoutes.get('/', async (req, res) => {
    const posts: HydratedDocument<IPost>[] = await getAllPosts();

    if (posts) {
        res.status(200).send(posts);
    } else {
        res.status(500).send();
    }
});

postsRoutes.get('/:id', async (req, res) => {
    const postId: number = Number(req.params.id);

    if (postId) {
        const post: HydratedDocument<IPost> = await getPostById(postId);
0
        if (post) {
            res.status(200).send(post);
        } else {
            res.status(500).send('error finding post');
        }
    } else {
        res.status(500).send('post ID should be a number');
    }
});

export default postsRoutes;