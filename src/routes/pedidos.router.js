const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidos.controller');

router.get('/create', controller.create);
router.post('/', controller.store);
router.get('/', controller.index);
router.get('/:id', controller.getById);
router.put('/:id', controller.updateEstado);
router.get('/:id/delete', controller.confirmDelete);
router.delete('/:id', controller.destroy);

//Rutas para la sexta tabla, detalle_pedidos
router.post('/:id/items', controller.addItem);
router.delete('/:id/items/:itemId', controller.removeItem);

module.exports = router;