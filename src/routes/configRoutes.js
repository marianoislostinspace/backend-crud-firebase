const express = require('express');
const router = express.Router();
const { obtenerConfig, agregarConfig, editConfig, eliminarConfig } = require('../controllers/configController');
const authMiddleware = require('../middlewares/authMiddleware');

//con esto protrege todas las rutas
router.use(authMiddleware)

//ruta para obtener una categoria
router.get('/', obtenerConfig);

// Ruta para crear una nueva categoría
router.post('/', agregarConfig);

// ruta para actualizar categorias
router.patch('/:configId', editConfig)

//ruta para eliminar la categoria
router.delete('/:configId', eliminarConfig);


module.exports = router;
