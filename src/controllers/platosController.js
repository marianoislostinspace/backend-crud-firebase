const { db } = require('../config/Firebase')
const multer = require('multer');
const { uploadImage } = require('../uploadController')


//OBTENER TODOS LOS PLATOS
const obtenerPlatos = async (req, res) => {
    try {
        const categoriasSnapshot = await db.collection('categorias').get();

        if (categoriasSnapshot.empty) {
            return res.status(404).json({ error: 'No hay categorías en la base de datos' });
        }


        let platos = [];

        for (const categoriaDoc of categoriasSnapshot.docs) {
            const categoriaId = categoriaDoc.id;
            const categoriaRef = categoriaDoc.ref;
            const platosSnapshot = await categoriaRef.collection('platos').get();

            for (const platoDoc of platosSnapshot.docs) {
                const platoData = platoDoc.data();
                const platoId = platoDoc.id;

                // 🔽 Obtener las opciones (toppings)
                const opcionesSnapshot = await categoriaRef
                    .collection('platos')
                    .doc(platoId)
                    .collection('opciones')
                    .get();

                const opciones = opcionesSnapshot.docs.map(opcionDoc => ({
                    id: opcionDoc.id,
                    ...opcionDoc.data()
                }));

                platos.push({
                    id: platoId,
                    categoriaId,
                    ...platoData,
                    opciones // 🔽 ahora el plato incluye sus toppings
                });
            }
        }

        res.json(platos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Error al obtener los platos' });
    }
};



//AGREGAR UN NUEVO PLATO
const agregarPlato = async (req, res) => {
    const { categoriaId } = req.params;
    const nuevoPlato = req.body;

    try {
        const categoriaRef = db.collection('categorias').doc(categoriaId);
        const doc = await categoriaRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        //si hay imagen subirla a cloudinary
        if (req.file) {
            const imgUrl = await uploadImage(req)
            nuevoPlato.imagen = imgUrl
        }

        const platoRef = await categoriaRef.collection('platos').add(nuevoPlato);
        res.status(201).json({ mensaje: 'Plato Agregado', id: platoRef.id, nuevoPlato });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el plato' });
    }
};



//ACTUALIZAR UN PLATO
const actualizarPlato = async (req, res) => {
    const { categoriaId, platoId } = req.params;
    const datosActualizados = req.body;

    try {
        const platoRef = db.collection('categorias')
            .doc(categoriaId)
            .collection('platos')
            .doc(platoId);

        const doc = await platoRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Plato no encontrado' });
        }

        // Subir imagen si se proporciona
        if (req.file) {
            const imageUrl = await uploadImage(req);
            datosActualizados.imagen = imageUrl;
        }

        await platoRef.update(datosActualizados);
        res.json({ message: 'Plato actualizado correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el plato' });
    }
};



//BORRAR UN PLATO
const eliminarPlato = async (req, res) => {
    const { categoriaId, platoId } = req.params

    try {
        const platoRef = db.collection('categorias').doc(categoriaId).collection('platos').doc(platoId)
        const doc = await platoRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Plato no encontrado' })
        }

        await platoRef.delete()
        res.json({ message: 'Plato eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el plato' })
    }
}




module.exports = { obtenerPlatos, agregarPlato, actualizarPlato, eliminarPlato }