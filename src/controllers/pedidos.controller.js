const Pedido = require('../models/pedido');
const DetallePedido = require('../models/detallePedido');
const Cliente = require('../models/cliente');
const Producto = require('../models/producto');
const { badRequest, notFound, serverError } = require('../helpers/errores');

const VOLVER = '/pedidos';
const TEXTO_VOLVER = 'Volver a pedidos';

const index = (req, res) => {
    Pedido.findAll((error, pedidos) => {
        if (error) return serverError(res, error, '/', 'Volver al inicio');
        res.render('pedidos/index', { pedidos });
    });
};

const create = (req, res) => {
    Cliente.findAll((error, clientes) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        const hoy = new Date().toISOString().split('T')[0];
        res.render('pedidos/create', { clientes, hoy });
    });
};

const store = (req, res) => {
    const cliente_id = Number(req.body.cliente_id) || null;
    const fecha = (req.body.fecha || '').trim();
    const estado = (req.body.estado || 'Pendiente').trim();
    const dedicatoria = (req.body.dedicatoria || '').trim();

    if (!fecha) return badRequest(res, 'La fecha del pedido es obligatoria.', '/pedidos/create', 'Volver al formulario');

    Pedido.create(cliente_id, fecha, estado, dedicatoria, 0, (error, nuevoID) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        //Redirige directo al detalle del pedido para agregarle los regalos
        res.redirect(`/pedidos/${nuevoID}`);
    });
};

const getById = (req, res) => {
    const { id } = req.params;
    Pedido.findById(id, (error, pedido) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);

        DetallePedido.findByPedidoId(id, (err, items) => {
            if (err) return serverError(res, err, VOLVER, TEXTO_VOLVER);

            Producto.findAll((err, productos) => {
                if (err) return serverError(res, err, VOLVER, TEXTO_VOLVER);
                res.render('pedidos/getById', { pedido, items, productos });
            });
        });
    });
};

const updateEstado = (req, res) => {
    const { id } = req.params;
    const estado = (req.body.estado || 'Pendiente').trim();
    const dedicatoria = (req.body.dedicatoria || '').trim();

    Pedido.updateEstado(id, estado, dedicatoria, (error, changes) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (changes === 0) return notFound(res, 'El pedido no existe.', VOLVER, TEXTO_VOLVER);
        res.redirect(`/pedidos/${id}`);
    });
};

const addItem = (req, res) => {
    const { id } = req.params;
    const producto_id = Number(req.body.producto_id);
    const cantidad = Number(req.body.cantidad);

    if (!producto_id || !Number.isInteger(cantidad) || cantidad <= 0) {
        return badRequest(res, 'Seleccioná un producto y una cantidad válida.', `/pedidos/${id}`, 'Volver al pedido');
    }

    Producto.findById(producto_id, (err, producto) => {
        if (err) return sererError(res, err, `/pedidos/${id}`, 'Volver al pedido');
        if (!producto) return notFound(res, 'El producto no existe.', `/pedidos/${id}`, 'Volver al pedido');

        DetallePedido.addItem(id, producto.id, cantidad, producto.precio, (err) => {
            if (err) return serverError(res, err, `/pedidos/${id}`, 'Volver al pedido');

            DetallePedido.calcularTotalPedido(id, (err, total) => {
                if (err) return serverError(res, err, `/pedidos/${id}`, 'Volver al pedido.');
                Pedido.updateTotal(id, total, (err) => {
                    if (err) return serverError(res, err, `/pedidos/${id}`, 'Volver al pedido');
                res.redirect(`/pedidos/${id}`);
                });
            });
        });
    });
};

const removeItem = (req, res) => {
    const { id, itemID } = req.params;
    DetallePedido.removeItem(itemID, (err) => {
        if (err) return serverError(res, err, `/pedidos/${id}`, 'Volver al pedido.');

        DetallePedido.calcularTotalPedido(id, (err, total) => {
            if (err) return serverError(res, err, `/pedidos/${id}`, 'Volver al pedido');
            Pedido.updateTotal(id, total, (err) => {
                if (err) return serverError(res, err, `/pedidos/${id}`, 'Volver al pedido');
                res.redirect(`/pedidos/${id}`);
            });
        });
    });
};

const confirmDelete = (req, res) => {
    Pedido.findById(req.params.id, (error, pedido) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (!pedido) return notFound(res, 'El pedido que querés eliminar no existe', VOLVER, TEXTO_VOLVER);
        res.render('pedidos/delete', { pedido });
    });
};

const destroy = (req, res) => {
    Pedido.destroy(req.params.id, (error, changes) => {
        if (error) return serverError(res, error, VOLVER, TEXTO_VOLVER);
        if (changes === 0) return notFound(res, 'El pedido que querés eliminar no existe.', VOLVER, TEXTO_VOLVER);
        res.redirect(VOLVER);
    });
};

module.exports = { index, create, store, getById, updateEstado, addItem, removeItem, confirmDelete, destroy };