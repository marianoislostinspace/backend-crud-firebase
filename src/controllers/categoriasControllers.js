const { db } = require('../config/Firebase');
const { uploadImage } = require('../uploadController');


//OBTENER CATEGORIAS
const obtenerCategorias = async (req, res) => {
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


// POST /categorias
const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const nuevaCategoria = {
      nombre,
      descripcion: descripcion || '',
      creadaEn: new Date()
    };

    //si hay imagen subirla a cloudinary
    if (req.file) {
      const imgUrl = await uploadImage(req)
      nuevaCategoria.imagen = imgUrl
    }

    const categoriaRef = await db.collection('categorias').add(nuevaCategoria);

    res.status(201).json({
      id: categoriaRef.id,
      ...nuevaCategoria
    });

  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


//PATCH ACTUALIZAR CATEGORIA
const editarCategoria = async (req, res) => {
  const { categoriaId } = req.params;
  const datosActualizados = req.body;

  try {
    const categoriaRef = db.collection('categorias').doc(categoriaId);
    const doc = await categoriaRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Subir imagen si se proporciona
    if (req.file) {
      const imageUrl = await uploadImage(req);
      datosActualizados.imagen = imageUrl;
    }

    await categoriaRef.update(datosActualizados);
    res.json({ mensaje: 'Categoría actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


//eliminar Categoria
const eliminarCategoria = async (req, res) => {
  const { categoriaId } = req.params;

  try {
    const categoriaRef = db.collection('categorias').doc(categoriaId);
    const doc = await categoriaRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    await categoriaRef.delete();
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};





module.exports = { obtenerCategorias, crearCategoria, editarCategoria, eliminarCategoria };
