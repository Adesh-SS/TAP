import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function connectDB() {
    mongoose
        .connect(
            process.env.DB_URI,
        )
        .then(() => {
            console.log('Connected to the database');
        })
        .catch((err) => {
            console.error(`Error connecting to the database. \n${err}`);
        });
}

export default connectDB;