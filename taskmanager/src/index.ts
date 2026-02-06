import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.js'; 

import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---

app.use(cookieParser());

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://172.20.10.7:3000',
      process.env.FRONTEND_URL // Baad mein .env mein URL daal dena
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

app.use(cors({
  origin: true, 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- API Routes ---

app.use('/api', router);

// Root Health Check
app.get('/', (req: Request, res: Response) => {
  res.send({
    activeStatus: true,
    message: "Server is healthy",
  });
});

// --- Error Handling ---


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("SERVER ERROR:", err.stack);
  res.status(err.status || 500).json({ 
    success: false,
    error: err.message || 'Something went wrong!' 
  });
});

// Local development ke liye listen karein, lekin Vercel pe export karein
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;