
export const stringifyUpdatedUserFields = (isPasswordUpdated: boolean, isEmailUpdated: boolean): string => {
    let updatedFields: string = '';
    if (isPasswordUpdated) {
        updatedFields += 'password ';
    }
    if (isEmailUpdated) {
        updatedFields += 'email ';
    }

    return updatedFields;
}