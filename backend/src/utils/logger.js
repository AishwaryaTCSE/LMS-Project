// utils/logger.js

const formatMessage = (level, args) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${args.join(' ')}`;
};

module.exports = {
  info: (...args) => console.log(formatMessage('INFO', args)),
  warn: (...args) => console.warn(formatMessage('WARN', args)),
  error: (...args) => console.error(formatMessage('ERROR', args))
};
