import {IComment} from "./comment.interface";

export interface IPost {
    id?: string;
    senderId: string;
    content: string;
    comments: IComment[]
}