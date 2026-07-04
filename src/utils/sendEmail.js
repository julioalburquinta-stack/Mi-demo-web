import nodemailer from 'nodemailer'; // Librería para enviar correos electrónicos

// Función para enviar un correo electrónico
export const sendEmail = async (email, subject, text) => {
  try {
    // Verificamos que existan credenciales en variables de entorno
    if (!process.env.USER || !process.env.PASS) {
      throw new Error("Faltan credenciales en .env: USER o PASS");
    }

    // Configuración del transporte SMTP usando Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Servicio de correo
      auth: {
        user: process.env.USER, // Usuario (correo)
        pass: process.env.PASS, // Contraseña de aplicación (no la personal)
      },
      tls: {
        rejectUnauthorized: false, // Permite certificados autofirmados
      },
    });

    // Enviar el correo
    const info = await transporter.sendMail({
      from: `"No Reply" <${process.env.USER}>`, // Remitente
      to: email, // Destinatario
      subject, // Asunto del correo
      text, // Contenido en texto plano
    });

    console.log("Email enviado correctamente:", info.messageId); // Log de éxito
  } catch (error) {
    console.error("Error al enviar email:", error); // Log de error
    throw new Error("No se pudo enviar el correo. Revisa la configuración de SMTP."); // Error controlado
  }
};