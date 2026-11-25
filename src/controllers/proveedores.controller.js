const model = require('../models/proveedor');
const Producto = require('../models/producto');
const { badRequest, notFound, serverError } = require('../helpers/errores');

const VOLVER = '/proveedores';
const TEXTO_VOLVER = 'Volver a proveedores';

const limpiarDatos = (body) => ({
    nombre: (body.nombre || '').trim(),
    telefono: (body.telefono || '').trim(),
    email: (body.email || '').trim(),
    rubro: (body.rubro || '').trim(),
});

const index = (req, res) => {
    model.findAll((error, proveedores) => {
        if (error) return serverError(res, error, '/', 'Volver al inicio');
        res.render('proveedores/index', { proveedores });
    });
};

const getById = (req, res) => {
    model.findById(req.params.id, (error, proveedor) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (!proveedor) return notFound(res, 'El proveedor que buscás no existe.', VOLVER, TEXTO_VOLVER);
        res.render('proveedores/getById', { proveedor });
    });
};

const create = (req, res) => {
    res.render('proveedores/create', { proveedor: { nombre: '', telefono: '', email: '', rubro: '' } });
};

const store = (req, res) => {
    const { nombre, telefono, email, rubro } = limpiarDatos(req.body);
    if (!nombre) {
        return badRequest(res, 'El nombre del proveedor es obligatorio.', '/proveedores/create', 'Volver al formulario');
    }

    model.create(nombre, telefono, email, rubro, (error) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        res.redirect(VOLVER);
    });
};

const edit = (req, res) => {
    model.findById(req.params.id, (error, proveedor) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (!proveedor) return notFound(res, 'El proveedor que querés editar no existe.', VOLVER, TEXTO_VOLVER);
        res.render('proveedores/edit', { proveedor });
    });
};

const update = (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, email, rubro } = limpiarDatos(req.body);
    if (!nombre) {
        return badRequest(res, 'El nombre del proveedor es obligatorio.', `/proveedores/${id}/edit`, 'Volver al formulario');
    }

    model.update(id, nombre, telefono, email, rubro, (error, changes) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (changes === 0) return notFound(res, 'El proveedor que queres actualizar no existe.', VOLVER, TEXTO_VOLVER);
        res.redirect(VOVLER);
    });
};

const confirmDelete = (req, res) => {
    const { id } = req.params;
    model.findById(id, (error, proveedor) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (!proveedor) return notFound(res, 'El proveedor que querés eliminar no existe.', VOLVER, TEXTO_VOLVER);

        Producto.countByProvider(id, (error, productosAfectados) => {
            if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
            res.render('proveedores/delete', { proveedor, productosAfectados });
        });
    });
};

const destroy = (req, res) => {
    model.destroy(req.params.id, (error, changes) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (changes === 0) return notFound(res, 'El proveedor que querés eliminar no existe.', VOLVER, TEXTO_VOLVER);
        res.redirect(VOLVER);
    });
};

module.exports = { index, getById, create, store, edit, update, confirmDelete, destroy };