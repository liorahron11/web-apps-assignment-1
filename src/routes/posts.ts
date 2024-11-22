import express, {Router} from "express";
import {addPost, getAllPosts, getPostById, getPostsBySender, updatePost, getPostCommentsById, addCommentToPostId, updateCommentInPost, getSpecificCommentInPost} from "../queries/post-queries";
import {HydratedDocument} from "mongoose";
import {IPost} from "../interfaces/post.interface";
import { IComment } from "../interfaces/comment.interface";
const postsRoutes: Router = express.Router();

postsRoutes.post('/', async (req, res) => {
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
            res.status(200).send('post updated');
        } else {
            res.status(500).send('error updating the post');
        }
    } else {
        res.status(500).send('post ID should be a number');
    }
});

///////////////comments///////////////////


//get all comments by post id 
postsRoutes.get('/:id/comments', async (req, res) => {
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
postsRoutes.post('/:id/comment', async (req, res) => {
    const postId: number = Number(req.params.id);
    const newComment: IComment = req.body.comment;
    if (postId) {
     
        const postComments: IComment[] = await addCommentToPostId(postId, newComment);
        if (postComments) {
            res.status(200).send("add comment")
        } else {
            res.status(500).send('error adding a comment to the post');
        }   
    } else {
        res.status(500).send('post ID should be a number');
    }
    
});

// Update a comment in a post
postsRoutes.put('/:postId/comment', async (req, res) => {
    const postId: number = Number(req.params.postId);
    const commentId: number = Number(req.body.commentId);
    const newContent: string = req.body.content;

    const isUpdateSuccess: boolean = await updateCommentInPost(postId, commentId, newContent);

    if(isUpdateSuccess){
        return res.status(200).send("update comment");
    } else { 
        return res.status(500).send("error while update the comment");
    }
});

// delete a comment in a post
postsRoutes.delete('/:postId/comment', async (req, res) => {
    const postId: number = Number(req.params.postId);
    const commentId: number = Number(req.body.commentId);
    const newContent: string = req.body.content;

    const isUpdateSuccess: boolean = await updateCommentInPost(postId, commentId, newContent);

    if(isUpdateSuccess){
        return res.status(200).send("update comment");
    } else { 
        return res.status(500).send("error while delete the comment");
    }
});

// get a specif comment by id in a post by id
postsRoutes.get('/comment', async (req, res) => {
    const postId: number = Number(req.body.postId);
    const commentId: number = Number(req.body.commentId);

    const comment: IComment = await getSpecificCommentInPost(postId, commentId);

    if(comment){
        return res.status(200).send(comment);
    } else { 
        return res.status(500).send("error while find the comment");
    }
});

export default postsRoutes;