import express, {Router} from "express";
import {IComment} from "../interfaces/comment.interface";
import {
    addCommentToPostId,
    deleteCommentInPost,
    getPostCommentsById, getSpecificCommentInPost,
    updateCommentInPost
} from "../queries/post-queries";
import { Request, Response } from 'express';


const commentsRoutes: Router = express.Router();


//get all comments by post id 
const getCommentsById = async (req: Request, res: Response) => {
    const postId: string = req.params.id;

    if (postId) {
        const postComments: IComment[] = await getPostCommentsById(postId);

        if (postComments) {
            res.status(200).send(postComments);
        } else {
            res.status(500).send('error finding post');
        }
    } else {
        res.status(500).send('post ID should be a number');
    }
};


// add comment to post by id
const addCommentToPost = async (req: Request, res: Response) => {
    const postId: string = req.params.postId;
    const newComment: IComment = req.body.comment;
    if (postId) {

        const postComments: IComment[] = await addCommentToPostId(postId, newComment);
        if (postComments) {
            res.status(201).send("comment added successfully");
        } else {
            res.status(500).send('error adding a comment to the post');
        }
    } else {
        res.status(500).send('post ID should be a number');
    }

};

// Update a comment in a post
const updateComment = async (req: Request, res: Response) => {
    const postId: string = req.params.postId;
    const commentId: string = req.params.commentId;
    const newContent: string = req.body.content;

    const isUpdateSuccess: boolean = await updateCommentInPost(postId, commentId, newContent);

    if(isUpdateSuccess){
        return res.status(200).send("comment updated successfully");
    } else {
        return res.status(500).send("error while update the comment");
    }
};

// delete a comment in a post
const deleteComment = async (req: Request, res: Response) => {
    const postId: string = req.params.postId;
    const commentId: string = req.params.commentId;

    const isDeleteSuccess: boolean = await deleteCommentInPost(postId, commentId);

    if(isDeleteSuccess){
        return res.status(200).send("comment deleted successfully");
    } else {
        return res.status(500).send("error while deleting comment");
    }
};

// get a specif comment by id in a post by id
const getSpecificComment = async (req: Request, res: Response) => {
    const postId: string = req.params.postId;
    const commentId: string = req.params.commentId;

    const comment: IComment = await getSpecificCommentInPost(postId, commentId);

    if(comment){
        return res.status(200).send(comment);
    } else {
        return res.status(500).send("error while find the comment");
    }
};

export default {
    getCommentsById,
    addCommentToPost,
    updateComment,
    deleteComment,
    getSpecificComment
};
