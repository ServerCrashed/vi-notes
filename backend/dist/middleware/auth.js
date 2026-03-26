import jwt from 'jsonwebtoken';
function getCookieValue(cookieHeader, name) {
    if (!cookieHeader) {
        return null;
    }
    const cookies = cookieHeader.split(';');
    for (const cookie of cookies) {
        const trimmed = cookie.trim();
        const [key, ...rest] = trimmed.split('=');
        if (key === name) {
            return rest.join('=') || null;
        }
    }
    return null;
}
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length)
        : null;
    const cookieName = process.env.AUTH_COOKIE_NAME || 'vi_notes_token';
    const tokenFromCookie = getCookieValue(req.headers.cookie, cookieName);
    const token = tokenFromHeader || tokenFromCookie;
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        res.status(500).json({ error: 'server misconfigured' });
        return;
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }
    catch {
        res.status(401).json({ error: 'Unauthorized' });
    }
}
//# sourceMappingURL=auth.js.map