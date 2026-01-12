import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import logger from './config/logger.js';
import createHttpError from 'http-errors';

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to Auth Service');
});

// Global error handler
app.use(
  (
    err: unknown,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (createHttpError.isHttpError(err)) {
      statusCode = err.statusCode;
      message = err.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    logger.error(message, {
      path: req.path,
      method: req.method,
    });

    res.status(statusCode).json({
      errors: [
        {
          msg: message,
          path: '',
          location: '',
        },
      ],
    });
  },
);

export default app;
