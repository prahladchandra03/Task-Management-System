import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' }); // Short-lived 
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' }); // Long-lived [cite: 15]
  return { accessToken, refreshToken };
};