import { Router, Request, Response } from 'express';

const router = Router();

export const fileRouteHandler = () => {
  router.post('/upload');
  return router;
};

const uploadFileHandler = (req: Request, res: Response) => {};
