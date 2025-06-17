import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { ApiError } from './utils/ApiError.js';

const app = express();



app.use(cors({
  origin: "https://newcode-algo.onrender.com", // your frontend URL
  credentials: true
}));


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routes/user.route.js'
import codeRouter from './routes/code.route.js'

app.use('/api/users', userRouter)
app.use('/api/code', codeRouter)

// Global error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }
    
    // Handle other types of errors
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

export { app };
