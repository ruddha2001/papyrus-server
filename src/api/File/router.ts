import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadFileController } from './controller';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE!) * 1024 * 1024,
  },
});

export const fileRouteHandler = () => {
  router.post('/upload', upload.single('file'), uploadFileHandler);
  return router;
};

const uploadFileHandler = async (req: Request, res: Response) => {
  const { originalname, buffer, mimetype, size } = req.file;
  try {
    await uploadFileController('me@aniruddha.net', req.body.title, originalname, buffer, mimetype, size);
    res.json({ success: true, message: 'The file has been uploaded successfully' });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};
