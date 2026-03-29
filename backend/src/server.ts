import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { closeDb, connectDb } from './db.js';
import authRoutes from './routes/auth.js';
import sessionsRoutes from './routes/sessions.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const defaultAllowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

function normalizeOrigin(origin: string): string {
	return origin.trim().replace(/\/+$/, '');
}

const allowedOrigins = process.env.CORS_ORIGIN
	? process.env.CORS_ORIGIN.split(',').map(normalizeOrigin).filter(Boolean)
	: defaultAllowedOrigins.map(normalizeOrigin);

app.use(
	cors({
		origin(origin, callback) {
			if (!origin) {
				callback(null, true);
				return;
			}

			const normalizedOrigin = normalizeOrigin(origin);

			if (allowedOrigins.includes(normalizedOrigin)) {
				callback(null, true);
				return;
			}

			callback(new Error(`Origin ${origin} is not allowed by CORS`));
		},
		credentials: true,
	})
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
	res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionsRoutes);

async function startServer(): Promise<void> {
	await connectDb();
	app.listen(port, () => {
		console.log(`Backend server listening on http://localhost:${port}`);
	});
}

startServer().catch((error)=>{
	console.error('Failed to start backend:', error);
    process.exit(1);
});

process.on('SIGINT', async () => {
	await closeDb();
	process.exit(0);
});
