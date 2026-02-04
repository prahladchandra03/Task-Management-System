import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  // 1. firstName aur lastName bhi receive karein
  const { email, password, firstName, lastName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword,
        firstName, // Database me save karein
        lastName 
      }
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Email already exists" });
  }
};

export const login = async (req: Request, res: Response) => {
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
};