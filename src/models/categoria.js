const db = require('./sqlite');

const create = (nombre, descripcion, callback) => {
    const sql = `INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)`;
    db.run(sql, [nombre, descripcion], function (error) {
        if (error) return callback(error);
        callback(null, this.lastID);
    });
};

const findAll = (callback) => {
    db.all(`SELECT * FROM categorias ORDER BY nombre`, (error, rows) => {
        if (error) return callback(error);
        callback(null, rows);
    });
};
const findById = (id, callback) => {
    db.get(`SELECT * FROM categorias WHERE id = ?`, [id], (error, row) => {
        if (error) return callback(error);
        callback(null, row);
    });
};

const update = (id, nombre, descripcion, callback) => {
    const sql = `UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?`
    db.run(sql, [nombre, descripcion, id], function (error) {
        if (error) return callback(error);
        callback(null, this.changes);
    });
};

const destroy = (id, callback) => {
    db.run(`DELETE FROM categorias WHERE id = ?`, [id], function (error) {
        if (error) return callback(error);
        callback(null, this.changes);
    });
};

const count = (callback) => {
    db.get(`SELECT COUNT(*) AS total FROM categorias`, (error, row) => {
        if (error) return callback(error);
        callback(null, row.total);
    });
};
module.exports = { create, findAll, findById, update, destroy, count };
