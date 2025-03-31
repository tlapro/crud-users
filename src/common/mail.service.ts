import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendAccountDeletionEmail(to: string) {
    const emailContent = `
      <html>
        <head>
          <style>
            /* Estilos para el correo */
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>Confirmación de eliminación de cuenta</h2>
            </div>
            <div class="content">
              <p>Has solicitado la eliminación de tu cuenta. Lamentamos verte partir.</p>
              <p>Si no solicitaste esta acción, por favor contacta a nuestro equipo de soporte de inmediato.</p>
            </div>
            <div class="footer">
              <p>Si tienes alguna duda, puedes escribirnos a soporte@tudominio.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.mailerService.sendMail({
      to,
      subject: 'Eliminación de cuenta confirmada',
      html: emailContent,
    });
  }

  async sendRegistrationEmail(to: string) {
    const emailContent = `
      <html>
        <head>
          <style>
            /* Estilos para el correo */
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>¡Bienvenido a nuestra plataforma!</h2>
            </div>
            <div class="content">
              <p>Gracias por registrarte. Tu cuenta ha sido creada con éxito.</p>
              <p>Por favor, accede a tu cuenta para empezar a disfrutar de nuestros servicios.</p>
            </div>
            <div class="footer">
              <p>Si tienes alguna pregunta, no dudes en escribirnos.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.mailerService.sendMail({
      to,
      subject: 'Confirmación de registro',
      html: emailContent,
    });
  }
}
