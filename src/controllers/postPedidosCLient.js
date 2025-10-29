const { db } = require('../config/Firebase');

module.exports = (io) => {
  return async (req, res) => {
    const idPedidoCategory = 'KNMBYusxkf3fJjSUWZVB';
    const nuevoPedido = req.body;

    try {
      const categoriaPedidoRef = db.collection('pedidosCat').doc(idPedidoCategory);
      const counterRef = categoriaPedidoRef.collection("_meta").doc("counter");

      const nextId = await db.runTransaction(async (t) => {
        const counterDoc = await t.get(counterRef);

        let idNum = 1;
        if (counterDoc.exists) {
          idNum = counterDoc.data().value + 1;
          t.update(counterRef, { value: idNum });
        } else {
          t.set(counterRef, { value: idNum });
        }

        const pedidoRef = categoriaPedidoRef.collection("pedidos").doc(idNum.toString());
        t.set(pedidoRef, {
          ...nuevoPedido,
          estaArchivado: false,
          id: idNum,
          createdAt: new Date(),
        });

        return idNum;
      });

      io.emit('nuevo-pedido', { idNumerico: nextId, ...nuevoPedido });

      res.status(201).json({ mensaje: 'Pedido creado con éxito', id: nextId });

    } catch (error) {
      console.error('Error al crear el pedido:', error);
      res.status(500).json({ error: 'Error al crear el pedido' });
    }
  };
};
