const path = require('path');
const sqlite = require('sqlite3');

const db = new sqlite.Database(
    path.resolve(__dirname, '../../datos.db'),
    (error) => {
        if (error) {
            return console.error('Error al conectar con SQLite:', error);
        }

        db.serialize(() => {
            db.run('PRAGMA foreign_keys = ON');

            db.run(`CREATE TABLE IF NOT EXISTS categorias (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre VARCHAR(100) NOT NULL,
                descripcion VARCHAR(250)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS proveedores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre VARCHAR(100) NOT NULL,
                telefono VARCHAR(50),
                email VARCHAR(100),
                rubro VARCHAR(100)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre VARCHAR(150) NOT NULL,
                categoria_id INTEGER,
                proveedor_id INTEGER,
                precio REAL NOT NULL DEFAULT 0,
                stock INTEGER NOT NULL DEFAULT 0,
                descripcion VARCHAR(500),
                FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
                FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre VARCHAR(100) NOT NULL,
                telefono VARCHAR(50),
                email VARCHAR(100),
                notas VARCHAR(250)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS pedidos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cliente_id INTEGER,
                fecha VARCHAR(20) NOT NULL,
                estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
                dedicatoria VARCHAR(300),
                total REAL NOT NULL DEFAULT 0,
                FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS detalle_pedidos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pedido_id INTEGER NOT NULL,
                producto_id INTEGER,
                cantidad INTEGER NOT NULL DEFAULT 1,
                precio_unitario REAL NOT NULL DEFAULT 0,
                FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL
            )`);
        });
    }
);

module.exports = db;