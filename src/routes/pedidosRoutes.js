const express = require('express');
const pedidosController = require('../controllers/pedidosController');

module.exports = function (io) {

    
    
    const router = express.Router();
    const { obtenerPedidos, agregarPedido, EliminarPedido } = pedidosController(io);
    
    router.use()
    //ruta para obtener los pedidos
    router.get('/', obtenerPedidos);

    //ruta para agregar pedidos
    router.post('/', agregarPedido);

    //ruta para eliminar un pedido
    router.delete('/:pedidoId', EliminarPedido);

    return router;
};
