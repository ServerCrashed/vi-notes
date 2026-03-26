import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDb } from '../db.js';
const router = Router();
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'email and password are required' });
        return;
    }
    try {
        const db = getDb();
        const users = db.collection('users');
        const passwordHash = await bcrypt.hash(password, 10);
        await users.insertOne({
            _id: new ObjectId(),
            email: email.toLowerCase(),
            passwordHash,
            createdAt: new Date(),
        });
        res.status(201).json({ ok: true });
    }
    catch (error) {
        if (typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 11000) {
            res.status(409).json({ error: 'email already exists' });
            return;
        }
        res.status(500).json({ error: 'failed to register user' });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'email and password are required' });
        return;
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        res.status(500).json({ error: 'server misconfigured' });
        return;
    }
    try {
        const db = getDb();
        const users = db.collection('users');
        const user = await users.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({ error: 'invalid credentials' });
            return;
        }
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            res.status(401).json({ error: 'invalid credentials' });
            return;
        }
        const token = jwt.sign({ userId: user._id.toHexString() }, jwtSecret, { expiresIn: '7d' });
        res.json({ token });
    }
    catch {
        res.status(500).json({ error: 'failed to log in' });
    }
});
export default router;
//# sourceMappingURL=auth.js.map