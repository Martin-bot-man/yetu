const createRateLimiter = ({ windowMs, maxRequests }) => {
  const buckets = new Map();

  return (req, res, next) => {
    const key = req.ip || "unknown";
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    bucket.count += 1;
    if (bucket.count > maxRequests) {
      const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", retryAfterSeconds);
      return res.status(429).json({
        status: 429,
        message: "Too many requests. Please try again later.",
      });
    }

    return next();
  };
};

module.exports = createRateLimiter;
