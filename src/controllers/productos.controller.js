const model = require('../models/producto');
const Categoria = require('../models/categoria');
const Proveedor = require('../models/proveedor');
const { badRequest, notFound, serverError } = require('../helpers/errores');

const VOLVER = '/productos';
const TEXTO_VOLVER = 'Volver a productos';

const limpiarDatos = (body) => ({
    nombre: (body.nombre || '').trim(),
    categoria_id: Number(body.categoria_id) || null,
    proveedor_id: Number(body.proveedor_id) || null,
    precio: Number(body.precio),
    stock: Number(body.stock),
    descripcion: (body.descripcion || '').trim(),
});

const validar = (datos) => {
    if (!datos.nombre) return 'El nombre del producto es obligatorio.';
    if (Number.isNaN(datos.precio) || datos.precio < 0) return 'El precio debe ser igual o mayor que cero.';
    if (!Number.isInteger(datos.stock) || datos.stock < 0) return 'El stock debe ser un número entero igual o mayor que cero.';
    return null;
};

const esErrorFK = (error) => /FOREIGN KEY/i.test(error.message);

const index = (req, res) => {
    model.findAll((error, productos) => {
        if (error) return serverError(res, error, '/', 'Volver al inicio');
        res.render('productos/index', { productos });
    });
};

const getById = (req, res) => {
    model.findById(req.params.id, (error, producto) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (!producto) return notFound(res, 'El producto que buscás no existe.', VOLVER, TEXTO_VOLVER);
        res.render('productos/getById', { producto });
    });
};

const create = (req, res) => {
    const producto = { nombre: '', categoria_id: '', proveedor_id: '', precio: '', stock: 0, descripcion: '' };
    Categoria.findAll((err, categorias) => {
        if (err) return serverError(res, err, VOLVER, TEXTO_VOLVER);
        Proveedor.findAll((err, proveedores) => {
            if (err) return serverError(res, err, VOLVER, TEXTO_VOLVER);
            res.render('productos/create', { producto, categorias, proveedores });
        });
    });
};

const store = (req, res) => {
    const datos = limpiarDatos(req.body);
    const problema = validar(datos);
    if (problema) return badRequest(res, problema, '/productos/create', 'Volver al formulario');

    model.create(datos.nombre, datos.categoria_id, datos.proveedor_id, datos.precio, datos.stock, datos.descripcion, (error) => {
        if (error) {
            if (esErrorFK(error)) return badRequest(res, 'La categoría o proveedor seleccionado no existe.', '/productos/create', 'Volver al formulario');
            return serverError(res, error, VOLVER, TEXTO_VOLVER);
        }
        res.redirect(VOLVER);
    });
};

const edit = (req, res) => {
    model.findById(req.params.id, (error, producto) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (!producto) return notFound(res, 'El producto que querés editar no existe.', VOLVER, TEXTO_VOLVER);

        Categoria.findAll((err, categorias) => {
            if (err) return serverError(res, err, VOLVER, TEXTO_VOLVER);
            Proveedor.findAll((err, proveedores) => {
                if (err) return serverError(res, err, VOLVER, TEXTO_VOLVER);
                res.render('productos/edit', { producto, categorias, proveedores });
            });
        });
    });
};

const update = (req, res) => {
    const { id } = req.params;
    const datos = limpiarDatos(req.body);
    const problema = validar(datos);
    if (problema) return badRequest(res, problema, `/productos/${id}/edit`, 'Volver al formulario');

    model.update(id, datos.nombre, datos.categoria_id, datos.proveedor_id, datos.precio, datos.stock, datos.descripcion, (error, changes) => {
        if (error) {
            if (esErrorFK(error)) return badRequest(res, 'La categoría o proveedor seleccionado no existe.', `/productos/${id}/edit`, 'Volver al formulario');
            return serverError(res, error, VOLVER, TEXTO_VOLVER);
        }
        if (changes === 0) return notFound(res, 'El producto que querés actualizar no existe.', VOLVER, TEXTO_VOLVER);
        res.redirect(VOLVER);
    });
};

const confirmDelete = (req, res) => {
    model.findById(req.params.id, (error, producto) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (!producto) return notFound(res, 'El producto que querés eliminar no existe.', VOLVER, TEXTO_VOLVER);
        res.render('productos/delete', { producto });
    });
};

const destroy = (req, res) => {
    model.destroy(req.params.id, (error, changes) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (changes === 0) return notFound(res, 'El producto que querés eliminar no existe.', VOLVER, TEXTO_VOLVER);
        res.redirect(VOLVER);
    });
};

module.exports = { index, getById, create, store, edit, update, confirmDelete, destroy };
