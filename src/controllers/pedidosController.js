const { db } = require('../config/Firebase')

//Obtener pedidos
const obtenerPedidos = async (req, res) => {
    try {
        const categoriaPedidosSnapshot = await db.collection('pedidosCat').get()

        if (categoriaPedidosSnapshot.empty) {
            return res.status(404).json({ message: 'No hay Pedidos en la base de datos' })
        }
        let pedidos = []
        for (const pedidoDoc of categoriaPedidosSnapshot.docs) {
            const pedidoCatRef = pedidoDoc.ref;
            const pedidosSnapshot = await pedidoCatRef.collection('pedidos').get()

            if (!pedidosSnapshot.empty) {
                pedidos = [
                    ...pedidos,
                    ...pedidosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), pedidoId: pedidoDoc.id }))
                ]
            }
        }
        res.json(pedidos)
    } catch (err) {
        res.status(500).json({ err: 'Error al obtener los pedidos' })
    }
}




//Crear pedido
const agregarPedido = async (req, res) => {
    const idPedidoCategory = 'KNMBYusxkf3fJjSUWZVB'
    const nuevoPedido = req.body

    try {
        const categoriaPedidoRef = db.collection('pedidosCat').doc(idPedidoCategory)
        const doc = await categoriaPedidoRef.get()

        if (!doc.exists) {
            return res.status(404).json({ message: 'Categoria de pedidos no encontrada' })
        }

        const pedidoRef = await categoriaPedidoRef.collection('pedidos').add(nuevoPedido)
        res.status(201).json({ message: 'Pedido creado con exito', id: pedidoRef.id })
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pedido' })
    }
}


//Eliminar pedido
const EliminarPedido = async (req, res) => {
    const { pedidoId } = req.params;

    try {
        // Lógica para eliminar el pedido con ese ID
        await db.collection('pedidosCat').doc('KNMBYusxkf3fJjSUWZVB').collection('pedidos').doc(pedidoId).delete();

        res.status(200).json({ message: 'Pedido eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pedido' });
    }
};



module.exports = { obtenerPedidos, agregarPedido, EliminarPedido }