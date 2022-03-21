import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  max: 15,
  windowMs: 1 * 60 * 1000 // 1 minute
});
