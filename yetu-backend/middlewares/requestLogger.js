const logger = require("../utils/logger");
const crypto = require("crypto");

const requestLogger = (req, res, next) => {
  const startedAt = process.hrtime.bigint();
  const requestId = req.headers["x-request-id"] || crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  res.on("finish", () => {
    const elapsedNs = process.hrtime.bigint() - startedAt;
    const durationMs = Number(elapsedNs) / 1e6;
    logger.info("request.completed", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  });

  next();
};

module.exports = requestLogger;
