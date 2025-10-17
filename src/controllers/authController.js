const jwt = require("jsonwebtoken")
const { JWT_SECRET, JWT_EXPIRES } = require("../config/jwt.config");
require('dotenv').config();

const USERS = [
    { username: process.env.USERNAME1, password: process.env.PASSWORD1 },
    { username: process.env.USERNAME2, password: process.env.PASSWORD2 },
    { username: process.env.USERNAME3, password: process.env.PASSWORD3 },
]



const login = (req, res) => {
    const { username, password } = req.body

    const match = USERS.find(
        u => u.username === username && u.password === password
    )

    if (!match) {
        return res.status(401).json({ error: "Credenciales ivalidas Chaval" });

    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return res.json({ token })


}

module.exports = login