import express, {Router} from "express";
import {HydratedDocument} from "mongoose";
import {IUser} from "../interfaces/user.interface";
import {
    addUser,
    deleteUser,
    getAllUsers,
    getUserById, updateUserEmail,
    updateUserPassword,
    updateUserUsername
} from "../queries/user-queries";
import {isUserValid} from "../services/validation-service";
import isStrongPassword from "validator/lib/isStrongPassword";
import isEmail from "validator/lib/isEmail";
import {stringifyUpdatedUserFields} from "../services/query-utils";
const usersRoutes: Router = express.Router();

usersRoutes.get('/all', async (req, res) => {
    const posts: HydratedDocument<IUser>[] = await getAllUsers();

    if (posts) {
        res.status(200).send(posts);
    } else {
        res.status(500).send();
    }
});

usersRoutes.post('/', async (req, res) => {
    const user: IUser = req.body.user;

    try {
        if (isUserValid(user)) {
            const isUserAdded: boolean = await addUser(user);

            if (isUserAdded) {
                res.status(200).send('user added');
            } else {
                res.status(500).send('error adding user');
            }
        } else {
            res.status(500).send('user is missing');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

usersRoutes.get('/:id', async (req, res) => {
    const userId: number = Number(req.params.id);
    const user: HydratedDocument<IUser> = await getUserById(userId);

    if (user) {
        res.status(200).send(user);
    } else {
        res.status(500).send('error finding user');
    }
});

usersRoutes.delete('/:id', async (req, res) => {
    const userId: number = Number(req.params.id);
    const isDeleteSuccess: boolean = await deleteUser(userId);

    if (isDeleteSuccess){
        return res.status(200).send("user deleted");
    } else {
        return res.status(500).send("error while deleting user");
    }
});

usersRoutes.put('/:id', async (req, res) => {
    let {isPasswordUpdated, isUsernameUpdated, isEmailUpdated}: {isPasswordUpdated: boolean, isUsernameUpdated: boolean, isEmailUpdated: boolean} = {isPasswordUpdated: false, isUsernameUpdated: false, isEmailUpdated: false};
    let moreInfo: string = "";
    const userId: number = Number(req.params.id);

    const password: string = req.body.password?.toString();
    if (password && isStrongPassword(password)) {
        isPasswordUpdated = await updateUserPassword(userId, password);
    } else {
        moreInfo += "password is missing or not strong enough. ";
    }

    const username: string = req.body.username?.toString();
    if (username) {
        isUsernameUpdated = await updateUserUsername(userId, username);
    } else {
        moreInfo += "username is missing. ";
    }

    const email: string = req.body.email?.toString();
    if (email && isEmail(email)) {
        isEmailUpdated = await updateUserEmail(userId, email);
    } else {
        moreInfo += "email is missing or not valid. ";
    }

    if (isPasswordUpdated || isUsernameUpdated || isEmailUpdated){
        return res.status(200).send(`${stringifyUpdatedUserFields(isPasswordUpdated, isUsernameUpdated, isEmailUpdated)} updated. ${moreInfo}`);
    } else {
        res.status(500).send(`user not found or content up to date. ${moreInfo}`);
    }
});

export default usersRoutes;
