import {Schema, model, Model} from 'mongoose';
import {IUser} from "../interfaces/user.interface";
export type UserModel = Model<IUser>;

const userSchema: Schema<IUser, UserModel> = new Schema<IUser, UserModel>({
    email: {type: 'String', required: true, unique: true},
    username: {type: 'String', required: true, unique: true},
    password: {type: 'String', required: true},
    refreshToken: { type: [String], default: []}
});

export default model<IUser, UserModel>('User', userSchema);
