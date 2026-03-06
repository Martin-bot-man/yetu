const config = require("../config/config");
const logger = require("../utils/logger");

const globalErrorHandler = (err, req, res, next)=> {
    const statusCode = err.statusCode || 500;
    logger.error("request.failed", {
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode,
        error: logger.serializeError(err),
    });

    return res.status(statusCode).json({
        status:statusCode,
        message: err.message,
        requestId: req.requestId,
        errorStack: config.nodeEnv === "development" ? err.stack: ''
    })
}
module.exports = globalErrorHandler;
