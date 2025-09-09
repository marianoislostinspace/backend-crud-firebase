const express = require('express');
const router = express.Router();
const {obtenerCategorias, crearCategoria, editarCategoria, eliminarCategoria } = require('../controllers/categoriasControllers');
const multer = require('multer');
const upload = multer(); // almacenamiento en memoria
const authMiddleware = require("../middlewares/authMiddleware")

//con esto protrege todas las rutas
router.use(authMiddleware)

//ruta para obtener una categoria
router.get('/', obtenerCategorias);


// Ruta para crear una nueva categoría
router.post('/', upload.single('imagen'),crearCategoria);

// ruta para actualizar categorias
router.patch('/:categoriaId',upload.single('imagen'),editarCategoria )

//ruta para eliminar la categoria
router.delete('/:categoriaId', eliminarCategoria);


module.exports = router;
