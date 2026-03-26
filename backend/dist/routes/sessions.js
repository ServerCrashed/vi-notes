import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();
router.use(authMiddleware);
router.post('/start', async (req, res) => {
    if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const db = getDb();
        const sessions = db.collection('sessions');
        const result = await sessions.insertOne({
            _id: new ObjectId(),
            userId: new ObjectId(req.userId),
            startedAt: new Date(),
            pasteEvents: [],
            pasteStats: {
                pasteCount: 0,
                totalPastedChars: 0,
            },
        });
        res.status(201).json({ sessionId: result.insertedId.toHexString() });
    }
    catch {
        res.status(500).json({ error: 'failed to start session' });
    }
});
router.post('/:id/paste', async (req, res) => {
    const { id } = req.params;
    const { t, pastedCharCount, pastedLineCount } = req.body;
    if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (typeof t !== 'number' ||
        typeof pastedCharCount !== 'number' ||
        (pastedLineCount !== undefined && typeof pastedLineCount !== 'number')) {
        res.status(400).json({ error: 'invalid payload' });
        return;
    }
    if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: 'invalid session id' });
        return;
    }
    try {
        const db = getDb();
        const sessions = db.collection('sessions');
        const pasteEvent = { t, pastedCharCount };
        if (typeof pastedLineCount === 'number') {
            pasteEvent.pastedLineCount = pastedLineCount;
        }
        const result = await sessions.updateOne({ _id: new ObjectId(id), userId: new ObjectId(req.userId) }, {
            $push: { pasteEvents: pasteEvent },
            $inc: {
                'pasteStats.pasteCount': 1,
                'pasteStats.totalPastedChars': pastedCharCount,
            },
        });
        if (result.matchedCount === 0) {
            res.status(404).json({ error: 'session not found' });
            return;
        }
        res.json({ ok: true });
    }
    catch {
        res.status(500).json({ error: 'failed to record paste event' });
    }
});
router.post('/:id/end', async (req, res) => {
    const { id } = req.params;
    const { endedAt, finalCharCount, finalWordCount } = req.body;
    if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (typeof endedAt !== 'number' ||
        (finalCharCount !== undefined && typeof finalCharCount !== 'number') ||
        (finalWordCount !== undefined && typeof finalWordCount !== 'number')) {
        res.status(400).json({ error: 'invalid payload' });
        return;
    }
    if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: 'invalid session id' });
        return;
    }
    try {
        const db = getDb();
        const sessions = db.collection('sessions');
        const setPayload = {
            endedAt: new Date(endedAt),
        };
        if (finalCharCount !== undefined || finalWordCount !== undefined) {
            setPayload.docStats = {};
            if (finalCharCount !== undefined) {
                setPayload.docStats.finalCharCount = finalCharCount;
            }
            if (finalWordCount !== undefined) {
                setPayload.docStats.finalWordCount = finalWordCount;
            }
        }
        const result = await sessions.updateOne({ _id: new ObjectId(id), userId: new ObjectId(req.userId) }, { $set: setPayload });
        if (result.matchedCount === 0) {
            res.status(404).json({ error: 'session not found' });
            return;
        }
        res.json({ ok: true });
    }
    catch {
        res.status(500).json({ error: 'failed to end session' });
    }
});
export default router;
//# sourceMappingURL=sessions.js.map