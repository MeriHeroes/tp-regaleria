const db = require('./sqlite');

const create = (nombre, telefono, email, notas, callback) => {
    const sql = `INSERT INTO clientes (nombre, telefono, email, notas) VALUES (?, ?, ?, ?)`;
    db.run(sql, [nombre, telefono, email, notas], function (error) {
        if (error) return callback(error);
        callback(null, this.lastID);
    });
};

const findAll = (callback) => {
    db.all(`SELECT * FROM clientes ORDER BY nombre`, (error, rows) => {
        if (error) return callback(error);
        callback(null, rows);
    });
};

const findById = (id, callback) => {
    db.get(`SELECT * FROM clientes WHERE id = ?`, [id], (error, row) => {
        if (error) return callback(error);
        callback(null, row);
    });
};

const update = (id, nombre, telefono, email, notas, callback) => {
    const sql = `UPDATE clientes SET nombre = ?, telefono = ?, email = ?, notas = ? WHERE id = ?`;
    db.run(sql, [nombre, telefono, email, notas, id], function (error) {
        if (error) return callback(error);
        callback(null, this.changes);
    });
};

const destroy = (id, callback) => {
    db.run(`DELETE FROM clientes WHERE id = ?`, [id], function (error) {
        if (error) return callback(error);
        callback(null, this.changes);
    });
};

const count = (callback) => {
    db.get(`SELECT COUNT(*) AS total FROM clientes`, (error, row) => {
        if (error) return callback(error);
        callback(null, row.total);
    });
};

module.exports = { create, findAll, findById, update, destroy, count };