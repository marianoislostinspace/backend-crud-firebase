const express = require('express');
const agregarPedidoClient = require('../controllers/postPedidosCLient');

module.exports = function (io) {
  const router = express.Router();

  // Le pasás io cuando armás la ruta
  router.post('/', agregarPedidoClient(io));

  return router;
};
