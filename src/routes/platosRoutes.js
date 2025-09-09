const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // almacenamiento en memoria
const { obtenerPlatos, agregarPlato, actualizarPlato, eliminarPlato } = require('../controllers/platosController'); // Importar la función
const authMiddleware = require('../middlewares/authMiddleware')


router.use(authMiddleware)


// GET /platos/
router.get('/', obtenerPlatos);

// POST /platos/categorias/:categoriaId
router.post('/categorias/:categoriaId/platos', upload.single('imagen'), agregarPlato);

// PATCH /platos/categorias/:categoriaId/:platoId
router.patch('/categorias/:categoriaId/platos/:platoId', upload.single('imagen'), actualizarPlato);

// DELETE /platos/categorias/:categoriaId/:platoId
router.delete('/categorias/:categoriaId/:platoId', eliminarPlato);

module.exports = router;
