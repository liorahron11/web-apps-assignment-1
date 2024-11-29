import mongoose, {model, Model, Schema} from 'mongoose';
import {ConnectOptions} from "mongoose";
import {IPost} from "../interfaces/post.interface";
import {IComment} from "../interfaces/comment.interface";
import {IUser} from "../interfaces/user.interface";
export type PostModel = Model<IPost>;
export type CommentModel = Model<IComment>;
export type UserModel = Model<IUser>;
export let Post: PostModel;
export let User: UserModel;

export const connectToDB = () => {
    const mongoUrl: string = process.env.MONGO_URL;
    const mongoOptions: ConnectOptions = {
        dbName: process.env.MONGO_DB_NAME
    }

    mongoose.connect(mongoUrl, mongoOptions).then(() => {
        setEventsHandler();
        Post = initPostModel();
        User = initUserModel();

        console.log('mongo connection initialized');
    }).catch((error) => {
        console.error(error);
    });
};

const setEventsHandler = () => {
    mongoose.connection.on('error', (error) => {
        console.log('mongo error occurred', error);
    });
};

const initPostModel = () => {
    const commentSchema: Schema<IComment, CommentModel> = new Schema<IComment, CommentModel>({
        id: {type: 'Number', required: true, unique: true},
        senderId: {type: 'Number', required: true},
        content: {type: 'String', required: true}, 
    });

    const postSchema: Schema<IPost, PostModel> = new Schema<IPost, PostModel>({
        id: {type: 'Number', required: true, unique: true},
        senderId: {type: 'Number', required: true},
        content: {type: 'String', required: true}, 
        comments: [commentSchema]
    });

    return model<IPost, PostModel>('Post', postSchema);
};

const initUserModel = () => {
    const userSchema: Schema<IUser, UserModel> = new Schema<IUser, UserModel>({
        id: {type: 'Number', required: true, unique: true},
        username: {type: 'String', required: true, unique: true},
        email: {type: 'String', required: true, unique: true},
        password: {type: 'String', required: true},
    });

    return model<IUser, UserModel>('User', userSchema);
};