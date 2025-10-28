const { db } = require('../config/Firebase');
const { uploadImage } = require('../uploadController');

const pedidosController = (io) => {
  // Obtener pedidos
  const obtenerPedidos = async (req, res) => {
    try {
      const categoriaPedidosSnapshot = await db.collection('pedidosCat').get();
      if (categoriaPedidosSnapshot.empty) {
        return res.status(404).json({ error: 'No hay Pedidos en la base de datos' });
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


  // OBTENER NO-ARCHIVADOS 
  const obtenerPedidosNoarchivados = async (req, res) => {
    try {
      const categoriaPedidosSnapshot = await db.collection('pedidosCat').get();
      if (categoriaPedidosSnapshot.empty) {
        return res.status(404).json({ error: 'No hay Pedidos en la base de datos' });
      }

      let pedidos = [];
      for (const pedidoDoc of categoriaPedidosSnapshot.docs) {
        const pedidoCatRef = pedidoDoc.ref;
        const pedidosSnapshot = await pedidoCatRef.collection('pedidos').where('estaArchivado', '==', false).get();

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


  // OBTENER 20 PEDIDOS

  const obtenerPedidosCantidad = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const categoriaPedidosSnapshot = await db.collection('pedidosCat').get();
      if (categoriaPedidosSnapshot.empty) {
        return res.status(404).json({ error: 'No hay pedidos en la base de datos' });
      }

      let pedidos = [];

      for (const pedidoDoc of categoriaPedidosSnapshot.docs) {
        const pedidosSnapshot = await pedidoDoc.ref.collection('pedidos').get();
        pedidos.push(
          ...pedidosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            categoriaId: pedidoDoc.id,
          }))
        );
      }

      pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      const pedidosPaginados = pedidos.slice(skip, skip + limit);

      res.json({
        pedidos: pedidosPaginados,
        totalPedidos: pedidos.length,
        totalPages: Math.ceil(pedidos.length / limit),
        currentPage: page,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener los pedidos paginados' });
    }
  };





  // Crear pedido
  const agregarPedido = async (req, res) => {
    const idPedidoCategory = 'KNMBYusxkf3fJjSUWZVB';
    const nuevoPedido = req.body;

    try {
      const categoriaPedidoRef = db.collection('pedidosCat').doc(idPedidoCategory);
      const counterRef = categoriaPedidoRef.collection("_meta").doc("counter")

      // evitar Colisiones
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
          estaArchivado: false,
          id: idNum,
          createdAt: new Date(),
        });


        return idNum;
      });

      io.emit('nuevo-pedido', { id: pedidoRef.id, ...nuevoPedido, idNumerico: nextId });

      res.status(201).json({ error: 'Pedido creado con éxito', id: pedidoRef.id, idNumerico: nextId });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al crear el pedido' });
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
      res.json({ error: "Pedido actualizado correctamente" });
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
      res.status(500).json({ error: "Error al actualizar el pedido" });
    }
  };








  // Eliminar pedido
  const EliminarPedido = async (req, res) => {
    const { pedidoId } = req.params;

    try {
      await db
        .collection('pedidosCat')
        .doc('KNMBYusxkf3fJjSUWZVB')
        .collection('pedidos')
        .doc(pedidoId)
        .delete();

      res.status(200).json({ error: 'Pedido eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
  };

  return { obtenerPedidos, agregarPedido, editPedido, EliminarPedido, obtenerPedidosCantidad, obtenerPedidosNoarchivados };
};

module.exports = pedidosController;
