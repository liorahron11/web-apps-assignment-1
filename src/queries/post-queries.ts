import {IPost} from "../interfaces/post.interface";
import {HydratedDocument, UpdateWriteOpResult} from "mongoose";
import Post from "../models/post.model";
import { IComment } from "../interfaces/comment.interface";

export const addPost = async (post: IPost): Promise<boolean> => {
    const doc: HydratedDocument<IPost> = new Post(post);
    const res: HydratedDocument<IPost> = await doc.save();

    if (!res) {
        console.error('error occurred while adding post');

        return false
    } else {
        console.log(`post added successfully`);

        return true;
    }
}

export const getAllPosts = async (): Promise<HydratedDocument<IPost>[]> => {
    const posts: HydratedDocument<IPost>[] = await Post.find();

    if (!posts) {
        console.error(`could not find posts}`);
    } else {
        console.log(`posts found successfully`);

        return posts;
    }
}

export const getPostById = async (id: number): Promise<HydratedDocument<IPost>> => {
    const post: HydratedDocument<IPost> = await Post.findOne({id});

    if (!post) {
        console.error(`didnt find post ${id}`);
    } else {
        console.log(`post ${id} found successfully`);

        return post;
    }
}

export const getPostsBySender = async (senderId: number): Promise<HydratedDocument<IPost>[]> => {
    const posts: HydratedDocument<IPost>[] = await Post.find({senderId})

    if (!posts) {
        console.error(`didnt find posts for sender ${senderId}`);
    } else {
        console.log(`posts of sender ${senderId} found successfully`);

        return posts;
    }
}

export const updatePost = async (id: number, content: string): Promise<boolean> => {
    const result: UpdateWriteOpResult = await Post.updateOne({id}, {content});

    if (result.modifiedCount > 0) {
        console.log(`post ${id} content updated successfully`);

        return true;
    } else {
        console.log('post not found or content up to date');

        return false;
    }
}


export const getPostCommentsById = async (id: number): Promise<IComment[]> => {
    const post: HydratedDocument<IPost> = await getPostById(id);

    if (!post) {
        console.error(`didnt find post ${id}`);
    } else {
        console.log(`post ${id} found successfully`);

        return post.comments;
    }
}

export const addCommentToPostId = async (id: number, comment: IComment): Promise<IComment[]> => {
    const post: HydratedDocument<IPost> = await getPostById(id);

    if (!post) {
        console.error(`didnt find post ${id}`);
    } else {
        console.log(`post ${id} found successfully`);
        
        comment.id = post.comments.length + 1;

        post.comments.push(comment);
        await post.save();

        return post.comments;
    }
}

export const updateCommentInPost = async (postId: number, commentId: number ,newContent: string): Promise<boolean> => {
    const post: HydratedDocument<IPost> = await getPostById(postId);

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

export const deleteCommentInPost = async (postId: number, commentId: number): Promise<boolean> => {
    const post: HydratedDocument<IPost> = await Post.findOneAndUpdate(
        {id: postId},
        {$pull: { comments: { id: commentId } }},
        { new: true }
    );

    if (!post) {
        console.error(`didnt find post ${postId}`);
        return false;
    } else {
        
        console.log(`remove comment ${commentId} in post ${postId}`);
        return true;
    }
}

export const getSpecificCommentInPost = async (postId: number, commentId: number): Promise<IComment> => {
    const post: HydratedDocument<IPost> = await getPostById(postId);
    
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
