import { Router } from 'express';
import { memberController } from '../controllers/member.controller';
import { validate } from '../middlewares/validation';
import { requireAdmin } from '../middlewares/requireAdmin';
import {
  createMemberSchema,
  updateMemberSchema,
  memberIdSchema,
} from '../types/member.schema';

const router = Router();

router.get('/', memberController.getAllMembers.bind(memberController));

router.get(
  '/:id',
  validate(memberIdSchema, 'params'),
  memberController.getMemberById.bind(memberController),
);

router.post(
  '/',
  requireAdmin,
  validate(createMemberSchema, 'body'),
  memberController.createMember.bind(memberController),
);

router.put(
  '/:id',
  requireAdmin,
  validate(memberIdSchema, 'params'),
  validate(updateMemberSchema, 'body'),
  memberController.updateMember.bind(memberController),
);

router.delete(
  '/:id',
  requireAdmin,
  validate(memberIdSchema, 'params'),
  memberController.deleteMember.bind(memberController),
);

export default router;
