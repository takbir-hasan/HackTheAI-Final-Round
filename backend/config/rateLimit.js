import rateLimit from 'express-rate-limit';


// Stricts limiter for auth routes
export const authLimiter = rateLimit({
    windowMs: 5* 60 * 1000,
    max: 5, // 5 attemts per 5 minutes per IP
    message: {
        status: 429,
        error: "Too many attempts, Pleade try again later."
    }
});


// General limiter
export const generalLimiter = rateLimit({
    windowMs: 15* 60 * 1000,
    max: 100, // 100 attemts per 15 minutes per IP
    message: {
        status: 429,
        error: "Too many attempts, Pleade try again later."
    }
});