import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import errorMiddlware from './middlewares/error.middleware.js';
import courseRoutes from './routes/course.Routes.js'
import miscRoutes from './routes/miscellanous.router.js'
import paymentRoutes from './routes/payment.router.js'
import userRoutes from './routes/user.Routes.js'

config();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(null, false);
        },
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    })
  );

app.use(cookieParser());

app.use(morgan('dev'));

// Serve uploaded files when using local fallback for notes/uploads
app.use('/uploads', express.static('uploads'));

app.use('/ping',function(_req,res){
    res.send('Pong');
})

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/course', courseRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1', miscRoutes);
app.all('*',(_req,res)=>{
    res.status(404).send('OOPS!!  404 page not found ')
})
app.use(errorMiddlware);

export default app;