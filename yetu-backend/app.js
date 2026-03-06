const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const requestLogger = require("./middlewares/requestLogger");
const createRateLimiter = require("./middlewares/rateLimiter");
const logger = require("./utils/logger");
const app = express();


const PORT = config.port;
let isDbReady = false;
let server;
let isConnectingDb = false;
let isShuttingDown = false;

// Middlewares
const allowedOrigins = new Set(config.clientOrigins);
const apiRateLimiter = createRateLimiter({
    windowMs: config.apiRateLimitWindowMs,
    maxRequests: config.apiRateLimitMaxRequests,
});

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }
        const err = new Error("CORS: Origin not allowed");
        err.statusCode = 403;
        return callback(err);
    },
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(requestLogger);
app.use((req, res, next) => {
    res.setHeader("x-content-type-options", "nosniff");
    res.setHeader("x-frame-options", "DENY");
    res.setHeader("referrer-policy", "no-referrer");
    next();
});
app.use("/api", apiRateLimiter);


// Root Endpoint
app.get("/", (req,res) => {
    res.json({message : "Hello from POS Server!"});
})

app.get("/health", (req, res) => {
    const ready = isDbReady && mongoose.connection.readyState === 1;
    res.status(ready ? 200 : 503).json({
        status: ready ? "ok" : "degraded",
        mongo: ready ? "connected" : "disconnected",
    });
});

app.use("/api", (req, res, next) => {
    const ready = isDbReady && mongoose.connection.readyState === 1;
    if (!ready) {
        return res.status(503).json({
            status: 503,
            message: "Service unavailable. Database is not ready.",
        });
    }
    return next();
});

// Other Endpoints
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));
app.use("/api/inventory", require("./routes/inventoryRoute"));

// Global Error Handler
app.use(globalErrorHandler);


// Server
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectWithRetry = async () => {
    if (isConnectingDb) return;
    isConnectingDb = true;

    while (!isDbReady) {
        try {
            await connectDB();
            isDbReady = true;
            logger.info("db.connected");
            break;
        } catch (error) {
            logger.error("db.connect_failed", {
                error: logger.serializeError(error),
                retryInMs: config.mongoRetryDelayMs,
            });
            await sleep(config.mongoRetryDelayMs);
        }
    }
    isConnectingDb = false;
};

const startServer = async () => {
    server = app.listen(PORT, () => {
        logger.info("server.started", { port: PORT, nodeEnv: config.nodeEnv });
    });
    connectWithRetry();
};

const shutdown = async (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    logger.info("server.shutdown_started", { signal });
    isDbReady = false;

    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }

    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }

    logger.info("server.shutdown_complete", { signal });
    process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
mongoose.connection.on("disconnected", () => {
    isDbReady = false;
    logger.warn("db.disconnected");
    connectWithRetry();
});
process.on("unhandledRejection", (reason) => {
    logger.error("process.unhandled_rejection", { reason: String(reason) });
});
process.on("uncaughtException", (error) => {
    logger.error("process.uncaught_exception", {
        error: logger.serializeError(error),
    });
});

startServer();
