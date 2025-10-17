const { db } = require('../config/Firebase');

module.exports = (io) => {
  return async (req, res) => {
    const idPedidoCategory = 'KNMBYusxkf3fJjSUWZVB';
    const nuevoPedido = req.body;

    try {
      const categoriaPedidoRef = db.collection('pedidosCat').doc(idPedidoCategory);
      const doc = await categoriaPedidoRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Categoria de pedidos no encontrada' });
      }

      const pedidoRef = await categoriaPedidoRef.collection('pedidos').add(nuevoPedido);

      // Emitimos evento al frontend usando io
      io.emit('nuevo-pedido', { id: pedidoRef.id, ...nuevoPedido });

      res.status(201).json({ error: 'Pedido creado con éxito', id: pedidoRef.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el pedido' });
    }
  };
};
