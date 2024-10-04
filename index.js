const express = require('express');
const sendgrid = require('@sendgrid/mail');
const cors = require('cors');
require('dotenv').config();

// Configurar SendGrid API Key

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, text, pdfBase64 } = req.body;

    // Log básico para verificar los datos recibidos
    console.log('Datos del correo:');
    console.log(`Destinatarios: ${to}`);
    console.log(`Asunto: ${subject}`);
    console.log(`Texto: ${text}`);
    console.log('Tamaño del PDF en base64:', pdfBase64.length);

    const msg = {
      to,
      from: 'Andres.pincheira.hidroservicio@gmail.com', // Asegúrate de usar un email verificado en SendGrid
      subject,
      text,
      attachments: [
        {
          content: pdfBase64,
          filename: 'Formulario.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };

    // Intentar enviar el correo
    const response = await sendgrid.send(msg);

    // Log de respuesta de SendGrid
    console.log('Respuesta de SendGrid:', response);

    // Responder con éxito solo una vez si el correo fue enviado correctamente
    return res.status(200).send('Email sent');
  } catch (error) {
    // Log detallado en caso de error
    console.error('Error al enviar el correo:', error);

    // Enviar el mensaje de error solo si hay un problema real
    return res.status(500).send(`Failed to send email. Error: ${error.message}`);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
