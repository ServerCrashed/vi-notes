import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';
import { toNewUserDoc, type UserDoc, USERS_COLLECTION } from '../models/user.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const cookieName = process.env.AUTH_COOKIE_NAME || 'vi_notes_token';

function getCookieSettings() {
	const isProduction = process.env.NODE_ENV === 'production';
	const configuredSameSite = (process.env.AUTH_COOKIE_SAME_SITE || 'lax').toLowerCase();
	const sameSite: 'lax' | 'strict' | 'none' =
		configuredSameSite === 'none'
			? 'none'
			: configuredSameSite === 'strict'
				? 'strict'
				: 'lax';
	const secure =
		process.env.AUTH_COOKIE_SECURE !== undefined
			? process.env.AUTH_COOKIE_SECURE === 'true'
			: isProduction || sameSite === 'none';
	const domain = process.env.AUTH_COOKIE_DOMAIN;

	return {
		httpOnly: true,
		sameSite,
		secure,
		maxAge: 7 * 24 * 60 * 60 * 1000,
		path: '/',
		...(domain ? { domain } : {}),
	};
}

router.post('/register', async (req, res) => {
	const { email, password } = req.body as { email?: string; password?: string };

	if (!email || !password) {
		res.status(400).json({ error: 'email and password are required' });
		return;
	}

	try {
		const db = getDb();
		const users = db.collection<UserDoc>(USERS_COLLECTION);

		const passwordHash = await bcrypt.hash(password, 10);
		await users.insertOne(
			toNewUserDoc({
				email,
				passwordHash,
			})
		);

		res.status(201).json({ ok: true });
	} catch (error: unknown) {
		if (
			typeof error === 'object' &&
			error !== null &&
			'code' in error &&
			(error as { code?: number }).code === 11000
		) {
			res.status(409).json({ error: 'email already exists' });
			return;
		}

		res.status(500).json({ error: 'failed to register user' });
	}
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body as { email?: string; password?: string };

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
		const users = db.collection<UserDoc>(USERS_COLLECTION);
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
		res.cookie(cookieName, token, getCookieSettings());
		res.json({ ok: true });
	} catch {
		res.status(500).json({ error: 'failed to log in' });
	}
});

router.get('/session', authMiddleware, (req, res) => {
	if (!req.userId) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}

	res.json({ authenticated: true });
});

router.post('/logout', (_req, res) => {
	const { maxAge: _maxAge, ...cookieSettings } = getCookieSettings();
	res.clearCookie(cookieName, cookieSettings);
	res.json({ ok: true });
});

export default router;
