import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Kept for authentication
import dotenv from 'dotenv';
import { router } from './routes'; // Kept named import from your project
import { errorHandler } from './middlewares/error.middleware'; // Kept existing error handler from your project

dotenv.config(); // From your new code

const app = express();
const port = process.env.PORT || 4000;

// Using the detailed CORS configuration you provided
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://172.20.10.7:3000' // This was in your code
    // For production, you may want to add your Vercel frontend URL here using an environment variable
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Kept for parsing form data
app.use(cookieParser()); // Kept for login/logout functionality

// API Routes
app.use('/api', router);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    activeStatus: true,
    error: false,
  });
});


// Using the existing error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
