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
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f9;
              margin: 0;
              padding: 0;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              background-color: #3498db;
              padding: 20px;
              color: white;
              border-radius: 8px 8px 0 0;
            }
            .header h2 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 20px;
              text-align: left;
              color: #333;
            }
            .footer {
              padding: 15px;
              text-align: center;
              font-size: 14px;
              color: #888;
              background-color: #f4f4f9;
              border-radius: 0 0 8px 8px;
            }
            a {
              color: #3498db;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>Confirmación de eliminación de cuenta</h2>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Has solicitado la eliminación de tu cuenta. Lamentamos verte partir y queremos asegurarnos de que todo esté en orden.</p>
              <p>Si no solicitaste esta acción, por favor contacta a nuestro equipo de soporte de inmediato.</p>
            </div>
            <div class="footer">
              <p>Si tienes alguna duda, puedes escribirnos a <a href="mailto:soporte@tudominio.com">soporte@tudominio.com</a></p>
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
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f9;
              margin: 0;
              padding: 0;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              background-color: #2ecc71;
              padding: 20px;
              color: white;
              border-radius: 8px 8px 0 0;
            }
            .header h2 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 20px;
              text-align: left;
              color: #333;
            }
            .footer {
              padding: 15px;
              text-align: center;
              font-size: 14px;
              color: #888;
              background-color: #f4f4f9;
              border-radius: 0 0 8px 8px;
            }
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

  async sendPasswordResetEmail(to: string, resetLink: string) {
    const emailContent = `
      <html>
        <head>
         <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
          }

          .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .header {
            text-align: center;
            background-color: #e74c3c;
            padding: 20px;
            color: white;
            border-radius: 8px 8px 0 0;
          }

          .header h2 {
            margin: 0;
            font-size: 24px;
          }

          .content {
            padding: 20px;
            text-align: center;
            color: #333;
          }

          .footer {
            padding: 15px;
            text-align: center;
            font-size: 14px;
            color: #888;
            background-color: #f4f4f9;
            border-radius: 0 0 8px 8px;
          }

          a {
            color: white;
            text-decoration: none;
            background-color: #f4f4f9;
            padding: 15px 30px;
            font-weight: bold;
            border-radius: 5px;
            display: inline-block;
            margin-top: 15px;
          }

          p {
            font-size: 16px;
          }

          .bold-text {
            font-weight: bold;
          }
        </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>Recuperación de contraseña</h2>
            </div>
            <div class="content">
              <p><span class="bold-text">Hemos recibido una solicitud</span> para restablecer tu contraseña.</p>
              <p><span class="bold-text">Si no solicitaste esto, ignora este correo.</span></p>
              <p>Haz clic en el siguiente botón para continuar con el restablecimiento de tu contraseña:</p>
              <a href="${resetLink}">Restablecer contraseña</a>
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
      subject: 'Recuperación de contraseña',
      html: emailContent,
    });
  }
}
