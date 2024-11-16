import {IComment} from "./comment.interface";

export interface IPost {
    id: number;
    senderId: number;
    content: string;
    comments: IComment[]
}