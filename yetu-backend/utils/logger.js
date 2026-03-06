const config = require("../config/config");

const serializeError = (error) => {
  if (!error) return undefined;
  return {
    name: error.name,
    message: error.message,
    stack: config.nodeEnv === "development" ? error.stack : undefined,
  };
};

const log = (level, message, context = {}) => {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...context,
  };
  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }
  console.log(line);
};

module.exports = {
  info: (message, context) => log("info", message, context),
  warn: (message, context) => log("warn", message, context),
  error: (message, context) => log("error", message, context),
  serializeError,
};
