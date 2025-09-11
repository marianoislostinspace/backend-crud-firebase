const { db } = require('../config/Firebase');


//OBTENER CATEGORIAS
const getCatClient = async (req, res) => {
    try {
        const snapshot = await db.collection('categorias').get();

        const categorias = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


module.exports = { getCatClient};
