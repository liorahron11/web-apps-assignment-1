import {IPost} from "../interfaces/post.interface";
import {HydratedDocument, UpdateWriteOpResult} from "mongoose";
import Post from "../models/post.model";
import { IComment } from "../interfaces/comment.interface";
import {isIdValid} from "../services/query-utils"

export const addNewPost = async (post: IPost): Promise<string> => {
    try {
        const doc: HydratedDocument<IPost> = new Post(post);
        const res: HydratedDocument<IPost> = await doc.save();

        if (!res.id) {
            console.error('error occurred while adding post');

            return "0";
        } else {
            console.log(`post added successfully`);

            return res.id;
        }
    } catch (error) {
        console.error('error occurred while adding post');

        return "0"
    }
    
}

export const fetchAllPosts = async (): Promise<HydratedDocument<IPost>[]> => {
    const posts: HydratedDocument<IPost>[] = await Post.find();

    if (!posts) {
        console.error(`could not find posts}`);
    } else {
        console.log(`posts found successfully`);

        return posts;
    }
}

export const fetchPostById = async (id: string): Promise<HydratedDocument<IPost>> => {
    let post: HydratedDocument<IPost>;
    if(isIdValid(id)) {
        post = await Post.findOne({_id: id});
    }
    
    if (!post) {
        console.error(`didnt find post ${id}`);
    } else {
        console.log(`post ${id} found successfully`);

    }
    return post;
}

export const fetchPostsBySender = async (senderId: string): Promise<HydratedDocument<IPost>[]> => {
    const posts: HydratedDocument<IPost>[] = await Post.find({senderId})

    if (!posts) {
        console.error(`didnt find posts for sender ${senderId}`);
    } else {
        console.log(`posts of sender ${senderId} found successfully`);

        return posts;
    }
}

export const updatePostDetails = async (id: string, content: string): Promise<boolean> => {
    const result: UpdateWriteOpResult = await Post.updateOne({_id: id}, { $set: {content: content}});

    if (result.modifiedCount > 0) {
        console.log(`post ${id} content updated successfully`);

        return true;
    } else {
        console.log('post not found or content up to date');

        return false;
    }
}


export const getPostCommentsById = async (id: string): Promise<IComment[]> => {
    const post: HydratedDocument<IPost> = await fetchPostById(id);

    if (!post) {
        console.error(`didnt find post ${id}`);
    } else {
        console.log(`post ${id} found successfully`);

        return post.comments;
    }
}

export const addCommentToPostId = async (id: string, comment: IComment): Promise<IComment[]> => {
    const post: HydratedDocument<IPost> = await fetchPostById(id);

    if (!post) {
        console.error(`didnt find post ${id}`);
    } else {
        console.log(`post ${id} found successfully`);
    
        const updatedPost = await Post.findOneAndUpdate(
            { _id: id },   
            { $push: { comments: comment } },  
            { new: true }                      
        );

        return updatedPost.comments;
    }
}

export const updateCommentInPost = async (postId: string, commentId: string ,newContent: string): Promise<boolean> => {
    const post: HydratedDocument<IPost> = await fetchPostById(postId);

    if (!post) {
        console.error(`didnt find post ${postId}`);
        return false;
    } else {
        const comment = post.comments.find(c => c.id === commentId);

        if(comment){
            comment.content = newContent;
            await post.save();

            return true;
        } 
        console.error(`didnt find comment ${commentId} for post ${postId}`);
        return false;
    }
}

export const deleteCommentInPost = async (postId: string, commentId: string): Promise<boolean> => {
    try {
        const post: HydratedDocument<IPost> = await Post.findOneAndUpdate(
            {_id: postId},
            {$pull: { comments: { _id: commentId } }},
            { new: true }
        );
    
        if (!post) {
            console.error(`didnt find post ${postId}`);
            return false;
        } else {
            
            console.log(`remove comment ${commentId} in post ${postId}`);
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
    
}

export const getSpecificCommentInPost = async (postId: string, commentId: string): Promise<IComment> => {
    const post: HydratedDocument<IPost> = await fetchPostById(postId);
    
    if (!post) {
        console.error(`didnt find post ${postId}`);
    } else {
        console.log(`post ${postId} found successfully`);
        const comment: IComment = post.comments.find((currComment: IComment) => currComment.id === commentId);

        if(comment) {
            console.log(`comment ${postId} found successfully`);
            return comment;
        } else { 
        console.error(`comment ${commentId} found for post ${postId}`);
        }
    }
}
