const express = require('express');
const pedidosController = require('../controllers/pedidosController');
const authMiddleware = require("../middlewares/authMiddleware")

module.exports = function (io) {



    const router = express.Router();
    const { obtenerPedidos, agregarPedido, editPedido, EliminarPedido, obtenerPedidosCantidad } = pedidosController(io);

    // router.use(authMiddleware)
    //ruta para obtener los pedidos
    router.get('/', obtenerPedidos);

    // ruta para obtener de a 20 pedidos
    router.get('/cantidad', obtenerPedidosCantidad);

    //ruta para agregar pedidos
    router.post('/', agregarPedido);

    // ruta para actualizar un pedido
    router.patch('/:pedidoId', editPedido);

    //ruta para eliminar un pedido
    router.delete('/:pedidoId', EliminarPedido);

    return router;
};
