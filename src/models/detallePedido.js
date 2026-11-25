const { callbackPromise } = require('nodemailer/lib/shared');
const db = require('./sqlite');

const findByPedidoId = (pedido_id, callback) => {
    const sql = `
    SELECT dp.id, dp.pedido_id, dp.producto_id, dp.cantidad, dp.precio_unitario,
    COALESCE(p.nombre, 'Producto eliminado') AS producto_nombre,
    (dp.cantidad * dp.precio_unitario) AS subtotal
    FROM detalle_pedidos dp
    LEFT JOIN productos p ON p.id = dp.producto_id
    WHERE dp.pedido_id = ?`;
    db.all(sql, [pedido_id], (error, rows) => {
        if (error) return callback(error);
        callback(null, rows);
    });
};

const addItem = (pedido_id, producto_id, cantidad, precio_unitario, callback) => {
    const sql = `INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)`;
    db.run(sql, [pedido_id, producto_id, cantidad, precio_unitario], function (error) {
        if (error) return callback(error);
        callback(null, this.lastID);
    });
};

const removeItem = (id, callback) => {
    db.run(`DELETE FROM detalle_pedidos WHERE id = ?`, [id], function (error) {
        if (error) return callback(error);
        callback(null, this.changes);
    });
};

const calcularTotalPedido = (pedido_id, callback) => {
    const sql = `SELECT COALESCE(SUM(cantidad * precio_unitario), 0) AS total FROM detalle_pedidos WHERE pedido_id = ?`;
    db.get(sql, [pedido_id], (error, row) => {
        if (error) return callback(error);
        callback(null, row.total);
    });
};

module.exports = { findByPedidoId, addItem, removeItem, calcularTotalPedido };