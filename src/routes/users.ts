import express, {Router} from "express";
import {HydratedDocument} from "mongoose";
import {IUser} from "../interfaces/user.interface";
import {addUser, deleteUser, getAllUsers, getUserById} from "../queries/user-queries";
import {isUserValid} from "../services/validation-service";
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

export default usersRoutes;
