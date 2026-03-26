import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

declare global {
	namespace Express {
		interface Request {
			userId?: string;
		}
	}
}

interface JwtPayload {
	userId: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}

	const token = authHeader.slice('Bearer '.length);
	const jwtSecret = process.env.JWT_SECRET;

	if (!jwtSecret) {
		res.status(500).json({ error: 'Server misconfigured' });
		return;
	}

	try {
		const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
		req.userId = decoded.userId;
		next();
	} catch {
		res.status(401).json({ error: 'Unauthorized' });
	}
}
