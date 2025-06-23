import mongoose from "mongoose"
import { DB_URI, NODE_ENV } from "../config/env.js"

if (!DB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.<development/production>.local')
}

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to Database in ${NODE_ENV} mode`);

    } catch (error) {
        console.log('Connection Error with Database', error);
        process.exit(1);
    }
}

export default connectDB;
