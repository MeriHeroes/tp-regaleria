const db = require('./sqlite');

const SELECT_COMPLETO = `
    SELECT p.id, p.nombre, p.categoria_id, p.proveedor_id, p.precio, p.stock, p.descripcion,
           COALESCE(c.nombre, 'Sin categoría') AS categoria_nombre,
           COALESCE(pr.nombre, 'Sin proveedor') AS proveedor_nombre
    FROM productos p
    LEFT JOIN categorias c ON c.id = p.categoria_id
    LEFT JOIN proveedores pr ON pr.id = p.proveedor_id`;

const create = (nombre, categoria_id, proveedor_id, precio, stock, descripcion, callback) => {
    const sql = `INSERT INTO productos (nombre, categoria_id, proveedor_id, precio, stock, descripcion) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [nombre, categoria_id, proveedor_id, precio, stock, descripcion], function (error) {
        if (error) return callback(error);
        callback(null, this.lastID);
    });
};

const findAll = (callback) => {
    db.all(`${SELECT_COMPLETO} ORDER BY p.id DESC`, (error, rows) => {
        if (error) return callback(error);
        callback(null, rows);
    });
};

const findById = (id, callback) => {
    db.get(`${SELECT_COMPLETO} WHERE p.id = ?`, [id], (error, row) => {
        if (error) return callback(error);
        callback(null, row);
    });
};

const update = (id, nombre, categoria_id, proveedor_id, precio, stock, descripcion, callback) => {
    const sql = `UPDATE productos 
                 SET nombre = ?, categoria_id = ?, proveedor_id = ?, precio = ?, stock = ?, descripcion = ? 
                 WHERE id = ?`;
    db.run(sql, [nombre, categoria_id, proveedor_id, precio, stock, descripcion, id], function (error) {
        if (error) return callback(error);
        callback(null, this.changes);
    });
};

const destroy = (id, callback) => {
    db.run(`DELETE FROM productos WHERE id = ?`, [id], function (error) {
        if (error) return callback(error);
        callback(null, this.changes);
    });
};

const countByCategory = (categoria_id, callback) => {
    db.get(`SELECT COUNT(*) AS total FROM productos WHERE categoria_id = ?`, [categoria_id], (error, row) => {
        if (error) return callback(error);
        callback(null, row.total);
    });
};

const countByProvider = (proveedor_id, callback) => {
    db.get(`SELECT COUNT(*) AS total FROM productos WHERE proveedor_id = ?`, [proveedor_id], (error, row) => {
        if (error) return callback(error);
        callback(null, row.total);
    });
};

const stats = (callback) => {
    db.get(`SELECT COUNT(*) AS totalProductos, COALESCE(SUM(stock), 0) AS totalStock FROM productos`, (error, row) => {
        if (error) return callback(error);
        callback(null, row);
    });
};

module.exports = { create, findAll, findById, update, destroy, countByCategory, countByProvider, stats };
