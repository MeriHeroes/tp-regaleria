const model = require('../models/categoria');
const Producto = require('../models/producto');
const { badRequest, notFound, serverError } = require('../helpers/errores');

const VOLVER = '/categorias';
const TEXTO_VOLVER = 'Volver a categorías';

const limpiarDatos = (body) => ({
    nombre: (body.nombre || '').trim(),
    descripcion: (body.descripcion || '').trim(),
});

const index = (req, res) => {
    model.findAll((error, categorias) => {
        if (error) return serverError(res, error, '/', 'Volver al inicio');
        res.render('categorias/index', { categorias });
    });
};

const getById = (req, res) => {
    model.findById(req.params.id, (error, categoria) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (!categoria) return notFound(res, 'La categoría que buscás no existe.', VOLVER, TEXTO_VOLVER);
        res.render('categorias/getById', { categoria });
    });
};

const create = (req, res) => {
    res.render('categorias/create', { categoria: { nombre: '', descripcion: '' } });
};

const store = (req, res) => {
    const { nombre, descripcion } = limpiarDatos(req.body);
    if(!nombre) {
        return badRequest(res, 'El nombre de la categoría es obligatorio', '/categorias/create', 'Volver al formulario');
    }

    model.create(nombre, descripcion, (error) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        res.redirect(VOLVER);
    });
};

const edit = (req, res) => {
    model.findById(req.params.id, (error, categoria) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (!categoria) return notFound(res, 'La ategoría que querés editar no existe.', VOLVER, TEXTO_VOLVER);
        res.render('categorias/edit', { categoria });
    });
};

const update = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = limpiarDatos(req.body);
    if (!nombre) {
        return badRequest(res, 'El nombre de la categoría es obligatorio.', `/categorias/${id}/edit`, 'Volver al formulario');
    }

    model.update(id, nombre, descripcion, (error, changes) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (changes === 0) return notFound(res, 'La categoría que querés actualizar no existe.', VOLVER, TEXTO_VOLVER);
        res.redirect(VOLVER);
    });
};

const confirmDelete = (req, res) => {
    const { id } = req.params;
    model.findById(id, (error, categoria) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (!categoria) return notFound(res, 'La categoría que querés eliminar no existe.', VOLVER, TEXTO_VOLVER);

        Producto.countByCategory(id, (error, productosAfectados) => {
            if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
            res.render('categorias/delete', { categoria, productosAfectados });
        });
    });
};

const destroy = (req, res) => {
    model.destroy(req.params.id, (error, changes) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (changes === 0) return notFound(res, 'La categoría que querés eliminar no existe.', VOLVER, TEXTO_VOLVER);
        res.redirect(VOLVER);
    });
};

module.exports = { index, getById, create, store, edit, update, confirmDelete, destroy };