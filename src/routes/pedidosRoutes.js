const express = require('express');
const pedidosController = require('../controllers/pedidosController');
const authMiddleware = require('../middlewares/authMiddleware');

module.exports = function (io) {

    router.use(authMiddleware)


    const router = express.Router();
    const { obtenerPedidos, agregarPedido, EliminarPedido } = pedidosController(io);

    //ruta para obtener los pedidos
    router.get('/', obtenerPedidos);

    //ruta para agregar pedidos
    router.post('/', agregarPedido);

    //ruta para eliminar un pedido
    router.delete('/:pedidoId', EliminarPedido);

    return router;
};
