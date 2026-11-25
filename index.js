require('dotenv').config({ quiet: true });

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const layouts = require('express-ejs-layouts');

const { notFound, serverError } = require('./src/helpers/errores');

app.use(express.urlencoded({ extended : false }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'src/views'));

//Guarda la ruta actual para marcar el boton activo en el menú
app.use((req, res, next) => {
    res.locals.ruta = req.path;
    next();
});

app.use(layouts);
app.set('layout', 'layouts/layout');

//Rutas principales
app.use('/', require('./src/routes/main.router'));
app.use('/categorias', require('./src/routes/categorias.router'));
app.use('/proveedores', require('./src/routes/proveedores.router'));
app.use('/productos', require('./src/routes/productos.router'));
app.use('/clientes', require('./src/routes/clientes.router'));
app.use('/pedidos', require('./src/routes/pedidos.router'));
app.use('/contacto', require('./src/routes/contacto.router'));

//Manejo global de errores (404 y 500)
app.use((req, res) => {
    notFound(res, `La página "${req.originalUrl}" no existe.`, '/', 'Volver al iniciio');
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    serverError(res, error, '/', 'Volver al inicio');
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});