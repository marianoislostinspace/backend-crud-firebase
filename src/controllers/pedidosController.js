const { db } = require('../config/Firebase');
const { uploadImage } = require('../uploadController');

const pedidosController = (io) => {
  // Obtener pedidos
  const obtenerPedidos = async (req, res) => {
    try {
      const categoriaPedidosSnapshot = await db.collection('pedidosCat').get();
      if (categoriaPedidosSnapshot.empty) {
        return res.status(404).json({ message: 'No hay Pedidos en la base de datos' });
      }

      let pedidos = [];
      for (const pedidoDoc of categoriaPedidosSnapshot.docs) {
        const pedidoCatRef = pedidoDoc.ref;
        const pedidosSnapshot = await pedidoCatRef.collection('pedidos').get();

        if (!pedidosSnapshot.empty) {
          pedidos = [
            ...pedidos,
            ...pedidosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), pedidoId: pedidoDoc.id })),
          ];
        }
      }

      res.json(pedidos);
    } catch (err) {
      res.status(500).json({ err: 'Error al obtener los pedidos' });
    }
  };



  // Crear pedido
  const agregarPedido = async (req, res) => {
    const idPedidoCategory = 'KNMBYusxkf3fJjSUWZVB';
    const nuevoPedido = req.body;

    try {
      const categoriaPedidoRef = db.collection('pedidosCat').doc(idPedidoCategory);
      const counterRef = categoriaPedidoRef.collection("_meta").doc("counter");

      const nextId = await db.runTransaction(async (t) => {
        const counterDoc = await t.get(counterRef);
        let idNum = 1;

        if (!counterDoc.exists) {
          t.set(counterRef, { lastId: 1 });
        } else {
          idNum = counterDoc.data().lastId + 1;
          t.update(counterRef, { lastId: idNum });
        }

        const pedidoRef = categoriaPedidoRef.collection("pedidos").doc(idNum.toString());

        t.set(pedidoRef, {
          ...nuevoPedido,
          id: idNum,
          createdAt: new Date(),
        });

        return idNum;
      });

      io.emit('nuevo-pedido', { ...nuevoPedido, id: nextId });

      res.status(201).json({
        message: 'Pedido creado con éxito',
        id: nextId,
      });
    } catch (error) {
      console.error("Error al crear pedido:", error);
      res.status(500).json({ message: 'Error al crear el pedido' });
    }
  };



  // Actualizar un pedido 
  const editPedido = async (req, res) => {
    const idPedidoCategory = 'KNMBYusxkf3fJjSUWZVB';
    const { pedidoId } = req.params;
    const datosActualizados = req.body

    try {
      const pedidoRef = db
        .collection('pedidosCat')
        .doc(idPedidoCategory)
        .collection('pedidos')
        .doc(pedidoId);

      const doc = await pedidoRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }
      if (req.file) {
        const imageUrl = await uploadImage(req);
        datosActualizados.imagen = imageUrl;
      }

      await pedidoRef.update(datosActualizados);
      res.json({ message: "Pedido actualizado correctamente" });
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
      res.status(500).json({ message: "Error al actualizar el pedido" });
    }
  };








  // Eliminar pedido
  const EliminarPedido = async (req, res) => {
    const { id } = req.params;

    try {
      await db
        .collection('pedidosCat')
        .doc('KNMBYusxkf3fJjSUWZVB')
        .collection('pedidos')
        .doc(id)
        .delete();

      res.status(200).json({ message: 'Pedido eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el pedido' });
    }
  };

  return { obtenerPedidos, agregarPedido, editPedido, EliminarPedido };
};

module.exports = pedidosController;
