import {IPost} from "../interfaces/post.interface";
import {HydratedDocument, UpdateWriteOpResult} from "mongoose";
import {Post} from "../services/mongo-handler";

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
    const posts: HydratedDocument<IPost>[] = await Post.find()

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

export const updatePost = async (id: number, content: string): Promise<void> => {
    Post.updateOne({id}, {content})
        .then((result: UpdateWriteOpResult) => {
        if (result.modifiedCount > 0) {
            console.log(`post ${id} content updated successfully`);
        } else {
            console.log('post not found or content up to date');
        }
    }).catch(error => {
        console.error('Error updating post:', error);
    });
}
