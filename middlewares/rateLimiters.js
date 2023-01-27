const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({
    windowMs: 60*1000, // 1 minute
    max: 5, //limit 5 requests
    //message: 'Too many login requests. Try again later'
    handler: (req, res, next) => {
        let err = new Error('Too many login requests. Try again later');
        err.status = 429; // 429 means Too Many Requests
        return next(err);
    }
});