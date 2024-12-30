// lior-aharon-212211684-shalev-lavyoud-322930561

import {connectToDB} from "./services/mongo-handler";
import postsRoutes from './routes/posts';
import express, {Express} from 'express';
import cors from 'cors';
import commentsRoutes from "./routes/comments";
import usersRoutes from "./routes/users";
// import authRoutes from "./routes/auth"
require('dotenv').config()

const app: Express = express();
app.use(express.json());
app.use(cors());

const initRoutes = (app: Express) => {
    app.use('/post', postsRoutes);
    app.use('/comment', commentsRoutes);
    app.use('/user', usersRoutes);
    // app.use('/auth', authRoutes);
};

const runApp = (app: Express) => {
    const port: number = Number(process.env.port);

    return app.listen(port, () => {
        return console.log(`app is running at port ${port}`);
    });
}

connectToDB();
initRoutes(app);
const server = runApp(app);

export default server;

// encrypt the passord
// add JWT Auth
// add registration, login, and logout endpoints
// add documentation using Swagger