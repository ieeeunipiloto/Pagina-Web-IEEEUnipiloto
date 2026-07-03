import nodemailer from 'nodemailer';
import { envConfig } from '../config/environment';
import { logger } from '../config/logger';

const SUBJECT = 'Peticion de vinculacion a semillero IoT e ITS';

const transporter = nodemailer.createTransport({
  host: envConfig.smtpHost,
  port: envConfig.smtpPort,
  secure: envConfig.smtpPort === 465,
  auth: {
    user: envConfig.smtpUser,
    pass: envConfig.smtpPass,
  },
});

export class ContactService {
  async sendContactEmail(senderEmail: string, message: string): Promise<void> {
    const mailOptions = {
      from: `"${senderEmail}" <${envConfig.smtpUser || 'noreply@unipiloto.edu.co'}>`,
      replyTo: senderEmail,
      to: envConfig.contactEmail,
      subject: SUBJECT,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">${SUBJECT}</h2>
          <hr style="border: 1px solid #e2e8f0;" />
          <p><strong>Correo de contacto:</strong> ${senderEmail}</p>
          <hr style="border: 1px solid #e2e8f0;" />
          <h3 style="color: #2d3748;">Mensaje:</h3>
          <p style="white-space: pre-wrap; color: #4a5568;">${message}</p>
          <hr style="border: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #a0aec0;">
            Este correo fue enviado desde el formulario de contacto del Semillero IOT E ITSS.
          </p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info('Contact email sent successfully', { senderEmail });
    } catch (error) {
      logger.error('Failed to send contact email', { senderEmail, error });
      throw new Error('No se pudo enviar el correo. Verifica la configuración SMTP.');
    }
  }
}

export const contactService = new ContactService();
