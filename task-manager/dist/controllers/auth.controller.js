import prisma from '../lib/prisma.js';
import { hashPassword, generateTokens } from '../utils/auth.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const register = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    try {
        const user = await prisma.user.create({
            data: { email, password: hashedPassword }
        });
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(400).json({ error: "Email already exists" });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const tokens = generateTokens(user.id);
    // Store refresh token in DB
    await prisma.refreshToken.create({
        data: { token: tokens.refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });
    res.json(tokens);
};
export const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.sendStatus(401);
    const dbToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
    });
    if (!dbToken || dbToken.expiresAt < new Date()) {
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        const tokens = generateTokens(user.userId);
        res.json(tokens);
    });
};
export const logout = async (req, res) => {
    const { refreshToken } = req.body;
    await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
    });
    res.sendStatus(204);
};
//# sourceMappingURL=auth.controller.js.map