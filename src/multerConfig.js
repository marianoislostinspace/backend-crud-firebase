const multer = require('multer');

// Configurar multer para recibir imágenes en memoria antes de enviarlas a Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;