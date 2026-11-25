const nodemailer = require("nodemailer"); // Cargo el modulo nodemailer
const { badRequest } = require('../helpers/errores');


// Convierte los caracteres especiales del HTML en texto inofensivo.
// Si alguien escribe <script>... en el mensaje, el correo lo muestra como texto y no lo ejecuta.
const escaparHtml = (texto) => texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');


const index = (req, res) => { // Define un manejador para la ruta raíz ('/')
    res.render("contacto");
}


const submit = async (req, res) => { // "async" porque adentro usamos "await"


    // NUEVO: limpiamos los datos. El nombre va en un encabezado del correo, así que
    // eliminamos los saltos de línea para que nadie pueda inyectar encabezados falsos.
    const name = (req.body.name || '').replace(/[\r\n]+/g, ' ').trim(); // \r\n son saltos de línea, + significa "uno o más", g significa "todas las ocurrencias"
    const mail = (req.body.mail || '').trim();
    const message = (req.body.message || '').trim();


    // NUEVO: validación en el servidor
    if (!name || !mail || !message) {
        return badRequest(res, 'Completá tu nombre, tu correo y el mensaje para poder enviarlo.', '/contacto', 'Volver al formulario');
    }


    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({ // extracto - https://mailtrap.io/sandboxes/ My Sandbox
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
    });


    try {
        const info = await transporter.sendMail({ // la funcion debe ser asincrona - extracto https://nodemailer.com/ Send a message
            from: `"${name}" <${mail}>`, // sender address - alt + 96 backticks
            to: "bedelia@ifts24.edu.ar, 21457896@ifts24.edu.ar", // list of recipients
            subject: "Formulario de Contacto", // subject line
            text: message, // plain text body
            html: `<pre>${escaparHtml(message)}</pre>`, // HTML body, <pre> respeta tal cual se escribio el mensaje
        });
        console.info(info);


        // NUEVO: el envío fue exitoso => mostramos una vista de confirmación
        res.render('contacto-exito', { name, mail });
    } catch (error) {
        console.error(error);


        // NUEVO: el envío falló => status 503 (servicio no disponible) y una vista que
        // le devuelve su mensaje a la persona para que no tenga que escribirlo de nuevo.
        res.status(503).render('contacto-error', { name, mail, message });
    }
}


module.exports = {
    index,
    submit,
}
