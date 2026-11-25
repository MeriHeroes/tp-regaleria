const Categoria = require('../models/categoria');
const Proveedor = require('../models/proveedor');
const Producto = require('../models/producto');
const Cliente = require('../models/cliente');
const Pedido = require('../models/pedido');
const { serverError } = require('../helpers/errores');

const index = (req, res) => {
    Categoria.count((err, totalCategorias) => {
        if (err) return serverError(res, err);

        Proveedor.count((err, totalProveedores) => {
            if (err) return serverError(res, err);

            Producto.stats((err, statsProductos) => {
                if (err) return serverError(res, err);

                Cliente.count((err, totalClientes) => {
                    if (err) return serverError(res, err);

                    Pedido.count((err, totalPedidos) => {
                        if (err) return serverError(res, err);

                        res.render('index', {
                            totalCategorias,
                            totalProveedores,
                            totalProductos: statsProductos.totalProductos,
                            totalStock: statsProductos.totalStock,
                            totalClientes,
                            totalPedidos,
                        });
                    });
                });
            });
        });
    });
};

module.exports = { index };