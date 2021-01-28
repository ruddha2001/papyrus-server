import { Router, Request, Response } from 'express';
import { fetchVersion } from './controller';

const router = Router();

export const fileRouteHandler = () => {
  router.get('/version', getVersionHandler);
  return router;
};

const getVersionHandler = (req: Request, res: Response) => {
  res.json({ status: true, version: fetchVersion() });
};
