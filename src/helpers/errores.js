// 400 – Bad Request: el usuario envió datos incorrectos (ej: nombre vacío)
const badRequest = (res, mensaje, volver = '/', textoVolver = 'Volver al inicio') => {
    res.status(400).render('errors/400', { mensaje, volver, textoVolver });
};


// 404 – Not Found: el recurso pedido no existe (ej: /categorias/999)
const notFound = (res, mensaje, volver = '/', textoVolver = 'Volver al inicio') => {
    res.status(404).render('errors/404', { mensaje, volver, textoVolver });
};


// 500 – Internal Server Error: falló algo en NUESTRO servidor (ej: error de la base de datos).
// Registramos el detalle técnico en la consola del servidor (lo vemos nosotros),
// pero a la persona le mostramos un mensaje amable SIN datos técnicos por seguridad.
const serverError = (res, error, volver = '/', textoVolver = 'Volver al inicio') => {
    console.error(error);
    res.status(500).render('errors/500', {
        mensaje: 'Ocurrió un problema inesperado en el servidor.',
        volver,
        textoVolver,
    });
};


module.exports = { badRequest, notFound, serverError };


