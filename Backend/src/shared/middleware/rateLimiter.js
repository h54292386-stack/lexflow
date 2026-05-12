import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 8, 
    message: {
        success: false,
        message: "Too many attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false
});

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: {
        success: false,
        message: "Too many requests. Please slow down."
    }
});