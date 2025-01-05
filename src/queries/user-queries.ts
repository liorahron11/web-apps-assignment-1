import {IUser} from "../interfaces/user.interface";
import {DeleteResult, HydratedDocument, UpdateWriteOpResult} from "mongoose";
import User from "../models/user.model";

export class UserQueriesService {
    public getAllUsers = async (): Promise<HydratedDocument<IUser>[]> => {
        const users: HydratedDocument<IUser>[] = await User.find()

        if (!users) {
            console.error(`could not find users`);
        } else {
            console.log(`users found successfully`);

            return users;
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

    public getUserById = async (id: string): Promise<HydratedDocument<IUser>> => {
        const user: HydratedDocument<IUser> = await User.findOne({_id: id});

        if (!user) {
            console.error(`could not find user`);
        } else {
            console.log(`user found successfully`);

            return user;
        }
    }

    public deleteUser = async (userId: string): Promise<boolean> => {
        const deleteResult: DeleteResult = await User.deleteOne({_id: userId});

        if (!deleteResult) {
            console.error(`didnt find user ${userId}`);
            return false;
        } else {
            console.info(`removed user ${userId}`);
            return true;
        }
    }

    public updateUserPassword = async (id: string, password: string): Promise<boolean> => {
        const result: UpdateWriteOpResult = await User.updateOne({_id: id}, { $set: {password: password}});

        if (result.modifiedCount > 0) {
            console.log(`user ${id} password updated successfully`);

            return true;
        } else {
            console.log('user not found or password up to date');

            return false;
        }
    }

    public updateUserEmail = async (id: string, email: string): Promise<boolean> => {
        const result: UpdateWriteOpResult = await User.updateOne({_id: id}, { $set: {email: email}});

        if (result.modifiedCount > 0) {
            console.log(`user ${id} email updated successfully`);

            return true;
        } else {
            console.log('user not found or email up to date');

            return false;
        }
    }
}
