import {IUser} from "../interfaces/user.interface";

export const stringifyUpdatedUserFields = (isPasswordUpdated: boolean, isUsernameUpdated: boolean, isEmailUpdated: boolean): string => {
    let updatedFields: string = '';
    if (isPasswordUpdated) {
        updatedFields += 'password ';
    }
    if (isUsernameUpdated) {
        updatedFields += 'username ';
    }
    if (isEmailUpdated) {
        updatedFields += 'email ';
    }

    return updatedFields;
}