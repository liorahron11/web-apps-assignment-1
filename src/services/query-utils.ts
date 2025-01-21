
export const stringifyUpdatedUserFields = (isPasswordUpdated: boolean, isUsernameUpdated: boolean ,isEmailUpdated: boolean): string => {
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

import mongoose from 'mongoose';


export const isIdValid = (id: string): boolean => {
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) return true;
    
    return false;
}