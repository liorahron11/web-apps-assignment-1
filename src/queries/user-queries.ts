import {IUser} from "../interfaces/user.interface";
import {DeleteResult, HydratedDocument, UpdateWriteOpResult} from "mongoose";
import User from "../models/user.model";

export class UserQueriesService {
    public getAllUsers = async (): Promise<HydratedDocument<IUser>[]> => {
        const posts: HydratedDocument<IUser>[] = await User.find()

        if (!posts) {
            console.error(`could not find users`);
        } else {
            console.log(`users found successfully`);

            return posts;
        }
    }

    public addUser = async (user: IUser): Promise<boolean> => {
        const doc: HydratedDocument<IUser> = new User(user);
        const res: HydratedDocument<IUser> = await doc.save();

        if (!res) {
            console.error('error occurred while adding user');

            return false
        } else {
            console.log(`user added successfully`);

            return true;
        }
    }

    public getUserById = async (id: number): Promise<HydratedDocument<IUser>> => {
        const user: HydratedDocument<IUser> = await User.findOne({id});

        if (!user) {
            console.error(`could not find user`);
        } else {
            console.log(`user found successfully`);

            return user;
        }
    }

    public getUserByUsernameAndPassword = async (username: string, password: string): Promise<HydratedDocument<IUser>> => {
        const user: HydratedDocument<IUser> = await User.findOne({username, password});

        if (!user) {
            console.error(`could not find user`);
        } else {
            console.log(`user found successfully`);

            return user;
        }
    }

    public deleteUser = async (userId: number): Promise<boolean> => {
        const deleteResult: DeleteResult = await User.deleteOne({id: userId});

        if (!deleteResult) {
            console.error(`didnt find user ${userId}`);
            return false;
        } else {
            console.info(`removed user ${userId}`);
            return true;
        }
    }

    public updateUserPassword = async (id: number, password: string): Promise<boolean> => {
        const result: UpdateWriteOpResult = await User.updateOne({id}, {password});

        if (result.modifiedCount > 0) {
            console.log(`user ${id} password updated successfully`);

            return true;
        } else {
            console.log('user not found or password up to date');

            return false;
        }
    }

    public updateUserUsername = async (id: number, username: string): Promise<boolean> => {
        const result: UpdateWriteOpResult = await User.updateOne({id}, {username});

        if (result.modifiedCount > 0) {
            console.log(`user ${id} username updated successfully`);

            return true;
        } else {
            console.log('user not found or username up to date');

            return false;
        }
    }

    public updateUserEmail = async (id: number, email: string): Promise<boolean> => {
        const result: UpdateWriteOpResult = await User.updateOne({id}, {email});

        if (result.modifiedCount > 0) {
            console.log(`user ${id} email updated successfully`);

            return true;
        } else {
            console.log('user not found or email up to date');

            return false;
        }
    }
}
