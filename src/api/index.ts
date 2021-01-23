import { Router, Request, Response, NextFunction } from 'express';
import LoggerInstance from '../loaders/logger';
import { fileRouteHandler } from './File/router';

export default (): Router => {
  const app = Router();

  app.use('/file', fileRouteHandler());
  app.use(errorHandler);

  return app;
};

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  LoggerInstance.error(err);
  res.status(500).json({ success: false, messsage: err.message });
  next();
};
