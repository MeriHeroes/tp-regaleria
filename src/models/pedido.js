const db = require('./sqlite');

const SELECT_PEDIDOS = `
SELECT pe.id, pe.cliente_id, pe.fecha, pe.estado, pe.dedicatoria, pe.total,
COALESCE(cl.nombre, 'Cliente ocasional') AS cliente_nombre
FROM pedidos pe
LEFT JOIN clientes cl ON cl.id =  pe.cliente_id`;

const create = (cliente_id, fecha, estado, dedicatoria, total, callback) => {
    const sql = `INSERT INTO pedidos (cliente_id, fecha, estado, dedicatoria, total) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [cliente_id, fecha, estado, dedicatoria, total], function (error) {
        if (error) return callback(error);
        callback(null, this.lastID);
    });
};

const findAll = (callback) => {
    db.all(`${SELECT_PEDIDOS} ORDER BY pe.id DESC`, (error, rows) => {
        if (error) return callback(error);
        callback(null, rows);
    });
};

const findById = (id, callback) => {
    db.get(`${SELECT_PEDIDOS} WHERE pe.id = ?`, [id], (error, row) => {
        if (error) return callback(error);
        callback(null, row);
    });
};

const updateEstado = (id, estado, dedicatoria, callback) => {
    const sql = `UPDATE pedidos SET estado = ?, dedicatoria = ? WHERE id = ?`;
    db.run(sql, [estado, dedicatoria, id], function (error) {
        if (error) return callback(error);
        callback(null, this.changes);
    });
};

const updateTotal = (id, total, callback) => {
    db.run(`UPDATE pedidos SET total = ? WHERE id = ?`, [total, id], function (error) {
        if (error) return callback(error);
        callback(null, this.changes);
    });
};

const destroy = (id, callback) => {
    db.run(`DELETE FROM pedidos WHERE id = ?`, [id], function (error) {
        if (error) return callback(error);
        callback(null, this.changes);
    });
};

const count = (callback) => {
    db.get(`SELECT COUNT(*) AS total FROM pedidos`, (error, row) => {
    if (error) return callback(error);
    callback(null, row.total);
    });
};

module.exports = { create, findAll, findById, updateEstado, updateTotal, destroy, count };