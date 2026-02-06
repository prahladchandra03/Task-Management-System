import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateTokens = (userId: string) => {
  // Render/Production ke liye Env vars use karein, nahi to fallback (Localhost)
  const accessTokenSecret = process.env.JWT_SECRET || "fallback_secret_change_me_in_prod";
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret_change_me_in_prod";

  const accessToken = jwt.sign({ userId }, accessTokenSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, refreshTokenSecret, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword,
        firstName,
        lastName 
      }
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    console.error("Register Error:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const tokens = generateTokens(user.id);
    
    // Store refresh token in DB
    await prisma.refreshToken.create({
      data: { token: tokens.refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7*24*60*60*1000) }
    });

    // 2. Response me Token ke sath User Details bhi bhejein
    res.json({
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};