export interface IUser {
    id?: string;
    password: string;
    email: string;
    refreshToken?: string[];
}