
import express from 'express';
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import nodeRouter from './routes/nodeRoutes';


dotenv.config();

const app = express();
const mongoUrl = process.env.MONGO_URL;
const server = http.createServer(app);

app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', nodeRouter);


if (process.env.NODE_ENV !== 'test') {
    if (!mongoUrl) {
        console.error("MONGO_URL is not defined in environment variables");
        process.exit(1);
    }

    mongoose
        .connect(mongoUrl as string)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error("MongoDB connection error:", err));

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
} else {
    console.log('Server is in TEST mode, skipping direct listen.');
}

export default app;