const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

const logger = winston.createLogger({
  level: 'http',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf((info) => `${info.timestamp} ${info.level} ${info.message}`)
  ),
  transports: [new winston.transports.File({ filename: 'app.log' })],
});

module.exports = logger;
