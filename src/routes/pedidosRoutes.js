const express = require('express')
const router = express.Router()
const{obtenerPedidos, agregarPedido, EliminarPedido} = require('../controllers/pedidosController')


//ruta para obtener los pedidos
router.get('/', obtenerPedidos)

//ruta para agregar pedidos
router.post('/', agregarPedido)

//ruta para eliminar un pedido
router.delete('/:pedidoId', EliminarPedido);

module.exports = router;