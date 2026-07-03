import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload';

const router = Router();

router.post(
  '/upload',
  upload.single('file'),
  uploadController.uploadFile.bind(uploadController),
);

export default router;
