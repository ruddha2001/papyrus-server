import { Router, Request, Response } from 'express';
import multer from 'multer';
import { downloadFileController, uploadFileController } from './controller';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE!) * 1024 * 1024,
  },
});

export const fileRouteHandler = () => {
  router.get('/download', downloadFileHandler);
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

const downloadFileHandler = async (req: Request, res: Response) => {
  try {
    const data = await downloadFileController('me@aniruddha.net', req.query.key as string);
    res.json({ success: true, originalName: data.originalName, url: data.url });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};
