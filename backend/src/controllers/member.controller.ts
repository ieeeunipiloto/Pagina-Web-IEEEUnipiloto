import { Request, Response } from 'express';
import { memberService } from '../services/member.service';
import { CreateMemberInput, UpdateMemberInput } from '../types/member.schema';
import { auditLog } from '../config/logger';

export class MemberController {
  async getAllMembers(req: Request, res: Response): Promise<void> {
    const members = await memberService.getAllMembers();
    res.status(200).json({
      success: true,
      data: members,
      count: members.length,
      correlationId: req.correlationId,
    });
  }

  async getMemberById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const member = await memberService.getMemberById(id);
    res.status(200).json({
      success: true,
      data: member,
      correlationId: req.correlationId,
    });
  }

  async createMember(req: Request, res: Response): Promise<void> {
    const data: CreateMemberInput = req.body;
    const member = await memberService.createMember(data);
    auditLog('MEMBER_CREATED', {
      memberId: member.id,
      memberName: member.name,
      correlationId: req.correlationId,
    });
    res.status(201).json({
      success: true,
      data: member,
      message: 'Miembro creado exitosamente',
      correlationId: req.correlationId,
    });
  }

  async updateMember(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: UpdateMemberInput = req.body;
    const member = await memberService.updateMember(id, data);
    auditLog('MEMBER_UPDATED', {
      memberId: id,
      correlationId: req.correlationId,
    });
    res.status(200).json({
      success: true,
      data: member,
      message: 'Miembro actualizado exitosamente',
      correlationId: req.correlationId,
    });
  }

  async deleteMember(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await memberService.deleteMember(id);
    auditLog('MEMBER_DELETED', {
      memberId: id,
      correlationId: req.correlationId,
    });
    res.status(200).json({
      success: true,
      message: 'Miembro eliminado exitosamente',
      correlationId: req.correlationId,
    });
  }
}

export const memberController = new MemberController();
