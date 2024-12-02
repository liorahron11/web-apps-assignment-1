import express, {Router} from "express";
import {IComment} from "../interfaces/comment.interface";
import {
    addCommentToPostId,
    deleteCommentInPost,
    getPostCommentsById, getSpecificCommentInPost,
    updateCommentInPost
} from "../queries/post-queries";

const commentsRoutes: Router = express.Router();


//get all comments by post id 
commentsRoutes.get('/:id', async (req, res) => {
    const postId: number = Number(req.params.id);

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
});


// add comment to post by id
commentsRoutes.post('/:postId', async (req, res) => {
    const postId: number = Number(req.params.postId);
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

});

// Update a comment in a post
commentsRoutes.put('/:postId/:commentId', async (req, res) => {
    const postId: number = Number(req.params.postId);
    const commentId: number = Number(req.params.commentId);
    const newContent: string = req.body.content;

    const isUpdateSuccess: boolean = await updateCommentInPost(postId, commentId, newContent);

    if(isUpdateSuccess){
        return res.status(200).send("comment updated successfully");
    } else {
        return res.status(500).send("error while update the comment");
    }
});

// delete a comment in a post
commentsRoutes.delete('/:postId/:commentId', async (req, res) => {
    const postId: number = Number(req.params.postId);
    const commentId: number = Number(req.params.commentId);

    const isDeleteSuccess: boolean = await deleteCommentInPost(postId, commentId);

    if(isDeleteSuccess){
        return res.status(200).send("comment deleted successfully");
    } else {
        return res.status(500).send("error while deleting comment");
    }
});

// get a specif comment by id in a post by id
commentsRoutes.get('/:postId/:commentId', async (req, res) => {
    const postId: number = Number(req.params.postId);
    const commentId: number = Number(req.params.commentId);

    const comment: IComment = await getSpecificCommentInPost(postId, commentId);

    if(comment){
        return res.status(200).send(comment);
    } else {
        return res.status(500).send("error while find the comment");
    }
});

export default commentsRoutes;
