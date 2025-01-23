import {IUser} from "../interfaces/user.interface";
import {DeleteResult, HydratedDocument, UpdateWriteOpResult} from "mongoose";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import {isIdValid} from "../services/query-utils"


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
        const userEmail: string = user.email;
        const retUser: HydratedDocument<IUser> = await User.findOne({email: userEmail});

        if(retUser){
            console.error('error occurred while adding user, user is exsiting');
            return false;
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(user.password, salt);
        user.password = encryptedPassword;

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
        let user: HydratedDocument<IUser>;
        if(isIdValid(id)) {
            user = await User.findOne({_id: id});    
        }
        
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
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        password = encryptedPassword;
        
        const result: UpdateWriteOpResult = await User.updateOne({_id: id}, { $set: {password: password}});

        if (result.modifiedCount > 0) {
            console.log(`user ${id} password updated successfully`);

            return true;
        } else {
            console.log('user not found or password up to date');

            return false;
        }
    }

    public updateUserUsername = async (id: string, username: string): Promise<boolean> => {
        const result: UpdateWriteOpResult = await User.updateOne({_id: id}, { $set: {username: username}});

        if (result.modifiedCount > 0) {
            console.log(`user ${id} username updated successfully`);

            return true;
        } else {
            console.log('user not found or username up to date');

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
///////////////////////////
    public getUserByUsernameAndPassword = async (username: string, password: string): Promise<HydratedDocument<IUser>> => {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        password = encryptedPassword;
        const user: HydratedDocument<IUser> = await User.findOne({username, password});

        if (!user) {
            console.error(`could not find user`);
        } else {
            console.log(`user found successfully`);

            return user;
        }
    }

    public getUserByEmailAndPassword = async (email: string, password: string): Promise<HydratedDocument<IUser>> => {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        password = encryptedPassword; 

        const user: HydratedDocument<IUser> = await User.findOne({email, password});

        if (!user) {
            console.error(`could not find user`);
        } else {
            console.log(`user found successfully`);

            return user;
        }
    }

    public getUserByEmail = async (email: string): Promise<HydratedDocument<IUser>> => {

        const user: HydratedDocument<IUser> = await User.findOne({email});

        if (!user) {
            console.error(`could not find user`);
        } else {
            console.log(`user found successfully`);

            return user;
        }
    }


    public updateUserRefreshTokens = async (id: string ,refreshToken: string[]): Promise<boolean> => {
        const result: UpdateWriteOpResult = await User.updateOne({_id: id}, { $set: {refreshToken: refreshToken}});

        if (result.modifiedCount > 0) {
            console.log(`user ${id} refresh token updated successfully`);

            return true;
        } else {
            console.log('user not found or refresh token up to date');

            return false;
        }
    }
}
