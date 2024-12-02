import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';
import {IUser} from "../interfaces/user.interface";

export const isUserValid = (user: IUser): boolean => {
    if (!user) {
        throw new Error('user is missing');
    }

    if (!user.id || !user.username || !user.email || !user.password) {
        throw new Error('missing user fields');
    }

    if (!isEmail(user.email)) {
        throw new Error('invalid email');
    }

    if (!isStrongPassword(user.password.toString(), {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
        throw new Error('password is weak');
    }

    return true;
}