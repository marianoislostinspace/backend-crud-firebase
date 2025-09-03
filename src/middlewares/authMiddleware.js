// const allowedUsers = ["www.mf044491@gmail.com"]


// const admin = require('firebase-admin')

// async function authMiddleware(req, res, next) {
//     const authHeader = req.headers.authorization
//     if (!authHeader) return res.status(401).json({ message: "No autorizado" })

//     const token = authHeader.split(" ")[1]

//     try {
//         const decodedToken = await admin.auth().verifyIdToken(token)

//         if(!allowedUsers.includes(decodedToken.email)){
//             return res.status(403).json({message:"Usuario no permitido"})
//         }

//         req.user = decodedToken
//         next()
//     } catch (error) {
//         res.status(401).json({message: "Token invalido"})
//     }
// }

// module.exports = authMiddleware