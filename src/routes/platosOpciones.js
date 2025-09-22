const express = require('express');
const router = express.Router();
const { agregarOpcion, obtenerOpciones, eliminarOpcion} = require('../controllers/opcionesPlatos');
const authMiddleware = require('../middlewares/authMiddleware');


router.use(authMiddleware)


// GET - obtener todas las opciones de un plato específico
router.get('/categorias/:categoriaId/platos/:platoId/opciones', obtenerOpciones);

// POST - agregar una nueva opción a un plato
router.post('/categorias/:categoriaId/platos/:platoId/opciones', agregarOpcion);

// DELETE - eliminar una opción
router.delete('/categorias/:categoriaId/platos/:platoId/opciones/:opcionId', eliminarOpcion);

module.exports = router;
