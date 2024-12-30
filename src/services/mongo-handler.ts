import mongoose from 'mongoose';
import {ConnectOptions} from "mongoose";

export const connectToDB = () => {
    const mongoUrl: string = process.env.MONGO_URL;
    const mongoOptions: ConnectOptions = {
        dbName: process.env.MONGO_DB_NAME
    }

    mongoose.connect(mongoUrl, mongoOptions).then(() => {
        setEventsHandler();

        console.log('mongo connection initialized');
    }).catch((error) => {
        console.error(error);
    });
};

const setEventsHandler = () => {
    mongoose.connection.on('error', (error) => {
        console.log('mongo error occurred', error);
    });
};
