const cloudinary = require('../src/cloudinaryCofig');

const uploadImage = (req) => {
    return new Promise((resolve, reject) => {
        const file = req.file;
        if (!file) {
            return reject(new Error('No se proporcionó ninguna imagen'));
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'recetas' }, 
            (error, result) => {
                if (error) return reject(error);
                if (result && result.secure_url) {
                    resolve(result.secure_url);
                } else {
                    reject(new Error('Error al obtener la URL segura'));
                }
            }
        );

        uploadStream.end(file.buffer);
    });
};

module.exports = { uploadImage };