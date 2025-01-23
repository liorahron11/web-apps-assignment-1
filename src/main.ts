// lior-aharon-212211684-shalev-lavyoud-322930561

import {connectToDB} from "./services/mongo-handler";
import postsRoutes from './routes/posts';
import express, {Express} from 'express';
import cors from 'cors';
import commentsRoutes from "./routes/comments";
import authRoutes from "./routes/auth"
import usersRoutes from "./routes/users";
require('dotenv').config()
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"

 const options = {
    definition: {
    openapi: "3.0.0",
    info: {
        title: "api for web assignment",
        version: "1.0.0",
        description: "REST server including authentication using JWT",
    },
    servers: [{url: `http://localhost:${process.env.PORT}`,},],
    },
    apis: ["./src/routes/*.ts"],
 };
 const specs = swaggerJsDoc(options);


const app: Express = express();
app.use(express.json());
app.use(cors());

const initRoutes = (app: Express) => {
    app.use('/posts', postsRoutes);
    app.use('/comments', commentsRoutes);
    app.use('/user', usersRoutes);
    app.use('/auth', authRoutes);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
};

const runApp = (app: Express) => {
    const port: number = Number(process.env.PORT);

    return app.listen(port, () => {
        return console.log(`app is running at port ${port}`);
    });
}

connectToDB();
initRoutes(app);
const server = runApp(app);

export default server;
