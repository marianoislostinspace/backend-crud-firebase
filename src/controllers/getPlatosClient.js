const { db } = require('../config/Firebase');


const getPlatosClient = async (req, res) => {
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
                    opciones 
                });
            }
        }

        res.json(platos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Error al obtener los platos' });
    }
};

module.exports = { getPlatosClient };
