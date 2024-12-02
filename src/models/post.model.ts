import {Schema, model, Model} from 'mongoose';
import {IComment} from "../interfaces/comment.interface";
import {IPost} from "../interfaces/post.interface";
export type PostModel = Model<IPost>;
export type CommentModel = Model<IComment>;

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

export default model<IPost, PostModel>('Post', postSchema);
