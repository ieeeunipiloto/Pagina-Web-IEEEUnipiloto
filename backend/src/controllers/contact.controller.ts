/**
 * controllers/contact.controller.ts — Controlador HTTP para Contacto.
 *
 * Recibe peticiones POST /api/contact con email y mensaje,
 * delega el envío del correo al ContactService, y registra
 * la acción en el log de auditoría.
 */

import { Request, Response } from 'express';
import { contactService } from '../services/contact.service';
import { ContactInput } from '../types/contact.schema';
import { auditLog } from '../config/logger';

export class ContactController {
  /** POST /api/contact — Enviar correo desde formulario de contacto */
  async sendContact(req: Request, res: Response): Promise<void> {
    const { email, message }: ContactInput = req.body;

    await contactService.sendContactEmail(email, message);

    auditLog('CONTACT_SENT', {
      senderEmail: email,
      correlationId: req.correlationId,
    });

    res.status(200).json({
      success: true,
      message: 'Correo enviado exitosamente. Te contactaremos pronto.',
      correlationId: req.correlationId,
    });
  }
}

export const contactController = new ContactController();
