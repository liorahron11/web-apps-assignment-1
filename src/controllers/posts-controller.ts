import express, {Router} from "express";
import {addNewPost, fetchAllPosts, fetchPostById, fetchPostsBySender, updatePostDetails} from "../queries/post-queries";
import {HydratedDocument} from "mongoose";
import {IPost} from "../interfaces/post.interface";
import { Request, Response } from 'express';
const postsRoutes: Router = express.Router();

const addPost = async (req: Request, res: Response) => {
    const post: IPost = req.body.post;

    if (post) {
        const postId: string = await addNewPost(post);
        if (postId != "0") {
            res.status(201).send({
                message: 'Post added successfully',
                postId: postId  
            });
        } else {
            res.status(500).send('error adding post');
        }
    } else {
        res.status(500).send('post is missing');
    }
};

const getAllPosts = async (req: Request, res: Response) => {
    const posts: HydratedDocument<IPost>[] = await fetchAllPosts();

    if (posts) {
        res.status(200).send(posts);
    } else {
        res.status(500).send();
    }
};

const getPostById = async (req: Request, res: Response) => {
    const postId: string = String(req.params.id);

    if (postId) {
        const post: HydratedDocument<IPost> = await fetchPostById(postId);

        if (post) {
            res.status(200).send(post);
        } else {
            res.status(500).send('error finding post');
        }
    } else {
        res.status(500).send('post ID should be a number');
    }
};

const getPostsBySenderId = async (req: Request, res: Response) => {
    const senderId: string = req.query.sender as string;

    if (senderId) {
        const posts: HydratedDocument<IPost>[] = await fetchPostsBySender(senderId);

        if (posts) {
            res.status(200).send(posts);
        } else {
            res.status(500).send('error finding posts');
        }
    } else {
        res.status(500).send('sender ID should be a number');
    }
};

const updatePost = async (req: Request, res: Response) => {
    const postId: string = req.params.id;
    const newContent: string = req.body.content;

    if (postId) {
        const isPostUpdated: boolean = await updatePostDetails(postId ,newContent);

        if (isPostUpdated) {
            res.status(200).send('post updated successfully');
        } else {
            res.status(500).send('error updating the post');
        }
    } else {
        res.status(500).send('post ID not exist');
    }
};

export default {
    addPost,
    getAllPosts,
    getPostById,
    getPostsBySenderId,
    updatePost
};