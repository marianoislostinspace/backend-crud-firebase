const { db } = require('../config/Firebase');
const { uploadImage } = require('../uploadController');

// Obtener configuraciones
const obtenerConfig = async (req, res) => {
    try {
        const configSnapshot = await db.collection('config').get();

        if (configSnapshot.empty) {
            return res.status(404).json({ error: 'No hay datos de configuración' });
        }

        let configData = [];

        for (const doc of configSnapshot.docs) {
            const configRef = doc.ref;
            const subCollectionSnapshot = await configRef.collection('configData').get();

            if (!subCollectionSnapshot.empty) {
                const subDocs = subCollectionSnapshot.docs.map((subDoc) => ({
                    id: subDoc.id,
                    ...subDoc.data(),
                    parentConfigId: doc.id,
                }));

                configData = [...configData, ...subDocs];
            }
        }

        res.json(configData);
    } catch (err) {
        console.error("Error al obtener configuraciones:", err);
        res.status(500).json({ err: 'Error al obtener los datos de configuración' });
    }
};


// Crear pedido
const agregarConfig = async (req, res) => {
    const nuevaConfig = req.body;

    try {
        const configRef = await db.collection('config').doc("configMain")

        const doc = await configRef.get()
        if (!doc.exists) {
            await configRef.set({ createdAt: new Date() })
        }

        const configdataRef = await configRef.collection("configData").add(nuevaConfig)

        res.status(201).json({ error: 'configuracion creada con éxito', id: configdataRef.id });

    } catch (error) {
        res.status(500).json({ error: 'Error al crear la Configuracion' });
    }
};


// Actualizar una Configracion 
const editConfig = async (req, res) => {
    const { configId } = req.params;
    const updatedconfig = req.body

    try {
        const configDataRef = db
            .collection('config')
            .doc("configMain")
            .collection('configData')
            .doc(configId);

        const doc = await configDataRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }


        await configDataRef.update(updatedconfig);
        res.json({ error: "Configuracion actualizada correctamente" });
    } catch (error) {
        console.error('Error al actualizar la configuracion:', error);
        res.status(500).json({ error: "Error al actualizar la configuracion" });
    }
};




// Eliminar pedido
const eliminarConfig = async (req, res) => {
    const { configId } = req.params;

    try {
        await db
            .collection('config')
            .doc("configMain")
            .collection('configData')
            .doc(configId).delete()

        res.status(200).json({ error: 'configuracion eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la configuracion' });
    }
};


module.exports = { obtenerConfig, agregarConfig, editConfig, eliminarConfig };
