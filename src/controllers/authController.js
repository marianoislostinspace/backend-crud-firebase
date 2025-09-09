const jwt = require("jsonwebtoken")
const { JWT_SECRET, JWT_EXPIRES } = require("../config/jwt.config");

const USERNAME = "adolf hitman"
const PASSWORD = "iHateNigger"

 const login = (req, res) => {
    const { username, password } = req.body

    if (username === USERNAME && password === PASSWORD) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        return res.json({ token })
    }

    return res.status(401).json({ message: "Credenciales ivalidas Chaval" });
}

module.exports = login