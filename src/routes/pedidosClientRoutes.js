const express = require('express');
const agregarPedidoClient = require('../controllers/postPedidosCLient');

module.exports = function (io) {

    
    
    const router = express.Router();
    const { agregarPedido} = pedidosController(io);
    
    //ruta para agregar pedidos
    router.post('/', agregarPedido);

    return router;
};
