import express from 'express';
import connectDB from './db/connect';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import postRouter from './routes/post';
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
const port = 3000;

//middleware for json
app.use(express.json());
// middleware for cookies
app.use(cookieParser());
//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/post', postRouter);

const start = async () => {
  try {
    // eslint-disable-next-line no-undef
    await connectDB(process.env.DATABASE_URL);
    app.listen(port, console.log(`server is listening on port ${port}...`));
  } catch (error) {
    console.error(error);
  }
};

start();
