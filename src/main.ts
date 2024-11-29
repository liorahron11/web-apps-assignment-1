// Lior Aharon 212211684
// Shalev Lavyoud 322930561

import {connectToDB} from "./services/mongo-handler";
import postsRoutes from './routes/posts';
import express, {Express} from 'express';
import cors from 'cors';
require('dotenv').config()

const app: Express = express();
app.use(express.json());
app.use(cors());

const initRoutes = (app: Express) => {
    app.use('/post', postsRoutes);
};

const runApp = (app: Express) => {
    const port: number = Number(process.env.port);

    app.listen(port, () => {
        return console.log(`app is running at port ${port}`);
    });
}

connectToDB();
initRoutes(app);
runApp(app);
