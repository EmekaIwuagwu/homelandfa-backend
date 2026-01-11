const { verifyToken } = require('../utils/authUtils');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const user = verifyToken(token);
    if (!user) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    req.user = user;
    next();
};

const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRole
};
