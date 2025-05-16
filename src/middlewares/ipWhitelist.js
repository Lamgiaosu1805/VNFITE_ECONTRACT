const ipWhitelist = ['14.224.135.196', '127.0.0.1']; // IP được phép

function ipFilterMiddleware(req, res, next) {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    console.log(clientIp)
    if (ipWhitelist.includes(clientIp)) {
        return next();
    }

    res.status(403).json({ message: 'Forbidden: IP not allowed' });
}

module.exports = ipFilterMiddleware