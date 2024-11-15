require('dotenv').config()
import express, {Express} from 'express';
import cors from 'cors';

const app: Express = express();
app.use(express.json());
app.use(cors());

const runApp = (app: Express) => {
    const port: number = Number(process.env.port);

    app.listen(port, () => {
        return console.log(`app is running at port ${port}`);
    });
}

runApp(app);
