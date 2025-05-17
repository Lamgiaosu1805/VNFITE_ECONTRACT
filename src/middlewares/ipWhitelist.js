const ipWhitelist = ['14.224.135.196', '14.225.24.1', '42.113.122.155', '42.113.122.118', '::1']; // IP được phép

function ipFilterMiddleware(req, res, next) {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    console.log(clientIp)
    if (ipWhitelist.includes(clientIp)) {
        return next();
    }

    res.status(403).json({ message: 'Forbidden: IP not allowed' });
}

module.exports = ipFilterMiddleware