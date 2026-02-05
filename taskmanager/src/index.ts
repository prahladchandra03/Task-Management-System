import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://172.20.10.7:3000' // Matches your mobile/network IP
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Required if you use cookies for auth
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});