import mongoose, {model, Model, Schema} from 'mongoose';
import {ConnectOptions} from "mongoose";
import {IPost} from "../interfaces/post.interface";
export type PostModel = Model<IPost>;
export let Post: PostModel;

export const connectToDB = () => {
    const mongoUrl: string = process.env.MONGO_URL;
    const mongoOptions: ConnectOptions = {
        dbName: process.env.MONGO_DB_NAME
    }

    mongoose.connect(mongoUrl, mongoOptions).then(() => {
        setEventsHandler();
        Post = initPostModel();

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
    const postSchema: Schema<IPost, PostModel> = new Schema<IPost, PostModel>({
        id: {type: 'Number', required: true, unique: true},
        senderId: {type: 'Number', required: true},
        content: {type: 'String', required: true}
    });

    return model<IPost, PostModel>('Post', postSchema);
};
