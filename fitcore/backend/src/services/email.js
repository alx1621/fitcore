const nodemailer = require("nodemailer");

let transporterPromise = null;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    );
  } else {
    transporterPromise = nodemailer.createTestAccount().then((testAccount) => {
      console.log("[email] Usando cuenta de prueba Ethereal (no se configuró SMTP real).");
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    });
  }

  return transporterPromise;
}

async function sendMail({ to, subject, text, html }) {
  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"FitCore" <no-reply@fitcore.com>',
      to,
      subject,
      text,
      html,
    });

    console.log(`[email] Correo enviado a ${to} (${subject})`);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[email] Vista previa (Ethereal, no es un correo real): ${previewUrl}`);
    }
  } catch (err) {
    console.error(`[email] No se pudo enviar el correo a ${to}:`, err.message);
  }
}

async function sendWelcomeEmail(user) {
  await sendMail({
    to: user.email,
    subject: "¡Bienvenido a FitCore!",
    text: `Hola ${user.name},\n\nTu cuenta en FitCore ya está lista. Ya puedes explorar el catálogo de ejercicios y armar tus propias rutinas personalizadas.\n\n— El equipo de FitCore`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#e8b93f;">¡Bienvenido a FitCore, ${user.name}!</h2>
        <p>Tu cuenta ya está lista. Ya puedes explorar el catálogo de ejercicios y armar tus propias rutinas personalizadas.</p>
        <p style="color:#888; font-size: 13px;">— El equipo de FitCore</p>
      </div>
    `,
  });
}

async function sendPasswordResetEmail(user, resetUrl) {
  await sendMail({
    to: user.email,
    subject: "Recupera tu contraseña de FitCore",
    text: `Hola ${user.name},\n\nRecibimos una solicitud para restablecer tu contraseña. Entra a este link (válido por 1 hora) para crear una nueva:\n\n${resetUrl}\n\nSi tú no pediste esto, puedes ignorar este correo.\n\n— El equipo de FitCore`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#e8b93f;">Recupera tu contraseña</h2>
        <p>Hola ${user.name}, recibimos una solicitud para restablecer tu contraseña de FitCore.</p>
        <p><a href="${resetUrl}" style="background:#e8b93f; color:#15171a; padding:10px 18px; border-radius:8px; text-decoration:none; font-weight:600;">Crear nueva contraseña</a></p>
        <p style="color:#888; font-size: 13px;">Este link es válido por 1 hora. Si tú no pediste esto, puedes ignorar este correo.</p>
      </div>
    `,
  });
}

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };