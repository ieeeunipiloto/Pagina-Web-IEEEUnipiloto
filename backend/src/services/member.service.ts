import fs from 'fs';
import path from 'path';
import { prisma } from '../config/database';
import { NotFoundError } from '../middlewares/errorHandler';
import { CreateMemberInput, UpdateMemberInput } from '../types/member.schema';
import { logger } from '../config/logger';

export class MemberService {
  async getAllMembers() {
    logger.info('Obteniendo todos los miembros');
    return prisma.member.findMany({
      orderBy: [
        { isLeader: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async getMemberById(id: string) {
    logger.info('Obteniendo miembro por ID', { memberId: id });
    const member = await prisma.member.findUnique({
      where: { id },
    });
    if (!member) {
      throw new NotFoundError('Miembro');
    }
    return member;
  }

  async createMember(data: CreateMemberInput) {
    logger.info('Creando nuevo miembro', { name: data.name });
    return prisma.member.create({
      data: {
        name: data.name,
        role: data.role,
        description: data.description,
        photo: data.photo,
        isLeader: data.isLeader ?? false,
      },
    });
  }

  async updateMember(id: string, data: UpdateMemberInput) {
    logger.info('Actualizando miembro', { memberId: id });
    await this.getMemberById(id);
    return prisma.member.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.role && { role: data.role }),
        ...(data.description && { description: data.description }),
        ...(data.photo !== undefined && { photo: data.photo }),
        ...(data.isLeader !== undefined && { isLeader: data.isLeader }),
      },
    });
  }

  async deleteMember(id: string) {
    logger.info('Eliminando miembro', { memberId: id });
    const member = await this.getMemberById(id);
    if (member.photo) {
      this.deleteLocalFile(member.photo);
    }
    await prisma.member.delete({
      where: { id },
    });
    return { message: 'Miembro eliminado exitosamente' };
  }

  private deleteLocalFile(imageUrl: string): void {
    try {
      if (imageUrl.startsWith('/uploads/')) {
        const filePath = path.resolve(__dirname, '../../uploads', path.basename(imageUrl));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          logger.info('Archivo local eliminado', { path: filePath });
        }
      }
    } catch (err) {
      logger.warn('No se pudo eliminar el archivo local', { imageUrl, error: err });
    }
  }
}

export const memberService = new MemberService();
