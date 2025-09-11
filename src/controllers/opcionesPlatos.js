const { db } = require('../config/Firebase')

//AGREGAR OPCIONES AL PLATO
const agregarOpcion = async (req, res) => {
    const { categoriaId, platoId } = req.params;
    const nuevaOpcion = req.body;

    try {
        const platoRef = db.collection('categorias')
            .doc(categoriaId)
            .collection('platos')
            .doc(platoId);

        const platoDoc = await platoRef.get();
        if (!platoDoc.exists) {
            return res.status(404).json({ error: 'Plato no encontrado' });
        }

        const opcionRef = await platoRef.collection('opciones').add(nuevaOpcion);
        res.status(201).json({ mensaje: 'Opción agregada', id: opcionRef.id });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar la opción' });
    }
};

// Obtener todas las opciones de un plato
const obtenerOpciones = async (req, res) => {
    const { categoriaId, platoId } = req.params;

    try {
        const opcionesSnapshot = await db.collection('categorias')
            .doc(categoriaId)
            .collection('platos')
            .doc(platoId)
            .collection('opciones')
            .get();

        if (opcionesSnapshot.empty) {
            return res.json([]);
        }

        const opciones = opcionesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(opciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las opciones' });
    }
};



//  Eliminar una opción de un plato
const eliminarOpcion = async (req, res) => {
    const { categoriaId, platoId, opcionId } = req.params;

    try {
        const opcionRef = db.collection('categorias')
            .doc(categoriaId)
            .collection('platos')
            .doc(platoId)
            .collection('opciones')
            .doc(opcionId);

        const doc = await opcionRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Opción no encontrada' });
        }

        await opcionRef.delete();
        res.json({ mensaje: 'Opción eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la opción' });
    }
};

module.exports = {
    agregarOpcion,
    obtenerOpciones,
    eliminarOpcion
};