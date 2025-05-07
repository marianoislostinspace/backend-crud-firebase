const express = require('express');
const router = express.Router();
const {obtenerCategorias, crearCategoria, editarCategoria, eliminarCategoria } = require('../controllers/categoriasControllers');

//ruta para obtener una categoria
router.get('/', obtenerCategorias);


// Ruta para crear una nueva categoría
router.post('/', crearCategoria);

// ruta para actualizar categorias
router.patch('/:categoriaId',editarCategoria )

//ruta para eliminar la categoria
router.delete('/:categoriaId', eliminarCategoria);


module.exports = router;
