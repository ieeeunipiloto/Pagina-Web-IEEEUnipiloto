import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.post(
  '/upload',
  requireAdmin,
  upload.single('file'),
  uploadController.uploadFile.bind(uploadController),
);

export default router;
