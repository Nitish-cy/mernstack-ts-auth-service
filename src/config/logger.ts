import winston from 'winston';
import { Config } from './index.js';
const isTestEnv = Config.NODE_ENV === 'test';
const { combine, timestamp, errors, json } = winston.format;

const logger = winston.createLogger({
  silent: isTestEnv,
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json(),
  ),
  defaultMeta: {
    service: 'auth-service',
    env: process.env.NODE_ENV,
  },
  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),

    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

export default logger;
