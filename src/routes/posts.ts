import express, {Router} from "express";
import {addPost, getAllPosts, getPostById, getPostsBySender, updatePost} from "../queries/post-queries";
import {HydratedDocument} from "mongoose";
import {IPost} from "../interfaces/post.interface";
const postsRoutes: Router = express.Router();

postsRoutes.post('/', async (req, res) => {
    const post: IPost = req.body.post;

    if (post) {
        const isPostAdded: boolean = await addPost(post);

        if (isPostAdded) {
            res.status(201).send('post added successfully');
        } else {
            res.status(500).send('error adding post');
        }
    } else {
        res.status(500).send('post is missing');
    }
});

postsRoutes.get('/all', async (req, res) => {
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

        if (post) {
            res.status(200).send(post);
        } else {
            res.status(500).send('error finding post');
        }
    } else {
        res.status(500).send('post ID should be a number');
    }
});

postsRoutes.get('/', async (req, res) => {
    const senderId: number = Number(req.query.sender);

    if (senderId) {
        const posts: HydratedDocument<IPost>[] = await getPostsBySender(senderId);

        if (posts) {
            res.status(200).send(posts);
        } else {
            res.status(500).send('error finding posts');
        }
    } else {
        res.status(500).send('sender ID should be a number');
    }
});

postsRoutes.put('/:id', async (req, res) => {
    const postId: number = Number(req.params.id);
    const newContent: string = req.body.content;

    if (postId) {
        const isPostUpdated: boolean = await updatePost(postId ,newContent);

        if (isPostUpdated) {
            res.status(200).send('post updated successfully');
        } else {
            res.status(500).send('error updating the post');
        }
    } else {
        res.status(500).send('post ID should be a number');
    }
});

export default postsRoutes;