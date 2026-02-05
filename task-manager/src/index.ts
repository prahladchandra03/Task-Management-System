import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.js';
import { error } from 'console';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
// backend/src/index.ts


app.use(cors({
  // Sabhi origins allow karne ke liye '*' use kar sakte hain (Dev mode ke liye)
  // Ya specific IP add karein:
  origin: [
    'http://localhost:3000', 
    'http://172.20.10.7:3000'
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Agar cookies ya authorization headers use kar rahe hain
}));
app.use(express.json()); // Body parser for JSON

// API Routes
app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.json({
    activeStatus: true,
    error: false,
  });
});


// Error Handling Middleware (Basic)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});