const db = require('./sqlite');

const create = (nombre, telefono, emmail, rubro, callback) => {
    const sql = `INSERT INTO proveedores (nombre, telefono, email, rubro) VALUES (?, ?, ?, ?)`;
    db.run(sql, [nombre, telefono, emmail, rubro], function (error) {
        if (error) return callback(error);
        callback(null, this.lastID);
    });
};

const findAll = (callback) => {
    db.all(`SELECT * FROM proveedores ORDER BY nombre`, (error, rows) => {
        if (error) return callback(error);
        callback(null, rows);
    });
};

const findById = (id, callback) => {
    db.get(`SELECT * FROM proveedores WHERE id = ?`, [id], (error, row) => {
        if (error) return callback(error);
        callback(null, row);
    });
};

const update = (id, nombre, telefono, email, rubro, callback) => {
    const sql = `UPDATE proveedores SET nombre = ?, telefono = ?, email = ?, rubro = ? WHERE id = ?`;
    db.run(sql, [nombre, telefono, email, rubro, id], function (error) {
        if (error) return callback(error);
        callback(null, this.changes);
    });
};

const destroy = (id, callback) => {
    db.run(`DELETE FROM proveedores WHERE id = ?`, [id], function (error) {
        if (error) return callback(error);
        callback(null, this.changes);
    });
};

const count = (callback) => {
    db.get(`SELECT COUNT (*) AS total FROM proveedores`, (error, row) => {
        if (error) return callback(error);
        callback(null, row.total);
    });
};

module.exports = { create, findAll, findById, update, destroy, count };