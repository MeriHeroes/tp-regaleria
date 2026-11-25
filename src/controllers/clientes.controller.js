const model = require('../models/cliente');
const { badRequest, notFound, serverError } = require('../helpers/errores');

const VOLVER = '/clientes';
const TEXTO_VOLVER = 'Volver a clientes';

const limpiarDatos = (body) => ({
    nombre: (body.nombre || '').trim(),
    telefono: (body.telefono || '').trim(),
    email: (body.email || '').trim(),
    notas: (body.notas || '').trim(),
});

const index = (req, res) => {
    model.findAll((error, clientes) => {
        if (error) return serverError(res, error, '/', 'Volver al inicio');
        res.render('clientes/index', { clientes });
    });
};

const getById = (req, res) => {
    model.findById(req.params.id, (error, cliente) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (!cliente) return notFound(res, 'El cliente que buscás no existe.', VOLVER, TEXTO_VOLVER);
        res.render('clientes/getById', { cliente });
    });
};

const create = (req, res) => {
    res.render('clientes/create', { cliente: { nombre: '', telefono: '', email: '', notas: '' } });
};

const store = (req, res) => {
    const { nombre, telefono, email, notas } = limpiarDatos(req.body);
    if (!nombre) return badRequest(res, 'El nombre del cliente es obligatorio.', '/clientes/create', 'Volver al formulario');

    model.create(nombre, telefono, email, notas, (error) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        res.redirect(VOLVER);
    });
};

const edit = (req, res) => {
    model.findById(req.params.id, (error, cliente) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (!cliente) return notFound(res, 'El cliente que querés editar no existe.', VOLVER, TEXTO_VOLVER);
        res.render('clientes/edit', { cliente });
    });
};

const update = (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, email, notas } = limpiarDatos(req.body);
    if (!nombre) return badRequest(res, 'El nombre del cliente es obligatorio.', `/clientes/${id}/edit`, 'Vovler al formulario');

    model.update(id, nombre, telefono, email, notas, (error, changes) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (changes === 0) return notFound(res, 'El cliente que querés actualizar no existe.', VOLVER, TEXTO_VOLVER);
        res.redirect(VOLVER);
    });
};

const confirmDelete = (req, res) => {
    model.findById(req.params.id, (error, cliente) => {
        if (error) return serverError(res, 'El cliente que querés eliminar no existe.', VOLVER, TEXTO_VOLVER);
        res.render('clientes/delete', { cliente });
    });
};

const destroy = (req, res) => {
    model.destroy(req.params.id, (error, changes) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (changes === 0) return notFound(res, 'El cliente que querés eliminar no existe.', VOLVER, TEXTO_VOLVER);
        res.redirect(VOLVER);
    });
};

module.exports = { index, getById, create, store, edit, update, confirmDelete, destroy };