import express, {Express} from 'express';
require('dotenv').config()

const app: Express = express();
const port: number = Number(process.env.port);

const runApp = (app: Express) => {
    app.listen(port, () => {
        return console.log(`app is running at port ${port}`);
    });
}

runApp(app);
