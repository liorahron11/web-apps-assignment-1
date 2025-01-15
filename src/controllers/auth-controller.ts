import express, {Router} from "express";
import {HydratedDocument} from "mongoose";
import {IUser} from "../interfaces/user.interface";
import { Request, Response } from 'express';
import {UserQueriesService} from "../queries/user-queries";
import {isUserValid, isLoginValuesValid} from "../services/validation-service";
import {authMiddleware} from "../middlewares/authMiddleware";
import bcrypt from "bcrypt";

const userQueryService: UserQueriesService = new UserQueriesService();
const jwt = require('jsonwebtoken');

type tTokens = {
    accessToken: string,
    refreshToken: string
}

const generateToken = (userId: string): tTokens | null => {
    if (!process.env.TOKEN_SECRET) {
        return null;
    }
    // generate token
    const random = Math.random().toString();
    const accessToken = jwt.sign({
        _id: userId,
        random: random
    },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES });

    const refreshToken = jwt.sign({
        _id: userId,
        random: random
    },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
};


const register = async (req: Request, res: Response) => {
    const user: IUser = req.body;

    try {
        if (isUserValid(user)) {

            const isUserAdded: boolean = await userQueryService.addUser(user);

            if (isUserAdded) {
                res.status(200).send('register success');
            } else {
                res.status(500).send('error while try to register');
            }
        } else {
            res.status(500).send('some information is missing');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const login = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    try {
        if(isLoginValuesValid(email, password)) {
            const retUser: HydratedDocument<IUser> = await userQueryService.getUserByEmail(email);

            if (retUser.password != null && retUser.email != null) {
                const match = await bcrypt.compare(password, retUser.password);

                if(match) {
                    const tokens = generateToken(retUser.id)
                    if (!tokens) {
                        res.status(500).send('Server Error');
                        return;
                    }
                    if (!retUser.refreshToken) {
                        retUser.refreshToken = [];
                    }
                    retUser.refreshToken.push(tokens.refreshToken);
                    userQueryService.updateUserRefreshTokens(retUser.id, retUser.refreshToken);

                    res.status(200).send(
                        {
                            accessToken: tokens.accessToken,
                            refreshToken: tokens.refreshToken,
                            _id: retUser._id
                        });
                
                } else {
                    res.status(500).send("error accourd");
                }
            } else {
                res.status(500).send('user not found');
            }
        } else {
            res.status(500).send('some information is missing or incorrect');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};


const refresh = async (req: Request, res: Response) => {
    try {
        const user: HydratedDocument<IUser> = await userQueryService.getUserById(req.params.userId);

        if(user == null) return res.status(403).send("error was accourd");
        if(!user.refreshToken.includes(req.params.token)){
            user.refreshToken = [];
            await userQueryService.updateUserRefreshTokens(user.id, user.refreshToken);
            return res.status(403).send("invalid request");
        }

        const tokens = generateToken(user.id)
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }

        user.refreshToken[user.refreshToken.indexOf(req.params.token)] = tokens.refreshToken;

        await userQueryService.updateUserRefreshTokens(user.id, user.refreshToken);
        res.status(200).send({
            'accessToken': tokens.accessToken,
            "refreshToken": tokens.refreshToken
        });
    } catch (error) {
        res.status(403).send(error.message);
    }
};

const logout = async (req: Request, res: Response) => {
    try {
        const user: HydratedDocument<IUser> = await userQueryService.getUserById(req.params.userId);

        if(user == null) return res.status(403).send("error was accourd");
        if(!user.refreshToken.includes(req.params.token)){
            user.refreshToken = [];
            await userQueryService.updateUserRefreshTokens(user.id, user.refreshToken);
            return res.status(403).send("invalid request");
        }

        user.refreshToken.splice(user.refreshToken.indexOf(req.params.token), 1);
        await userQueryService.updateUserRefreshTokens(user.id, user.refreshToken);
        res.status(200).send();
    } catch (error) {
        res.status(403).send(error.message);
    }
};


export default {
    register,
    login,
    refresh,
    logout
};