import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { validate } from '../middlewares/validation';
import { contactSchema } from '../types/contact.schema';

const router = Router();

router.post(
  '/contact',
  validate(contactSchema),
  contactController.sendContact.bind(contactController),
);

export default router;
