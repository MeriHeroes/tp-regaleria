const express = require('express'); // Importa el módulo Express
const router = express.Router(); // Crea un enrutador de Express


const controller = require('../controllers/contacto.controller') // Importamos el controlador que contiene la lógica para manejar las solicitudes


// Define una ruta para la raíz del servidor
router.get('/', controller.index); // Cuando hago una solicitud GET a la raiz, se llamara a la funcion index del controlador


router.post('/', controller.submit) // Llama a la funcion submit del controlador


module.exports = router; // Exporta el enrutador para que pueda ser utilizado en otros archivos
