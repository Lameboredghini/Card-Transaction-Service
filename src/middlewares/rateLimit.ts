import rateLimit from 'express-rate-limit';

function rateLimiter(timePeriodInSecsForRateCheck: number, requestCountAllowedInTimePeriod: number) {
  return rateLimit({
    windowMs: timePeriodInSecsForRateCheck * 1000,
    max: requestCountAllowedInTimePeriod,
    message: {
      error: 'TooManyRequests',
      message: `Too many requests from this IP, please try again later.`,
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

export default rateLimiter;
