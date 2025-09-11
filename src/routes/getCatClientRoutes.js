const express = require('express');
const router = express.Router();
router.get('/', getCatClient);
const { getCatClient } = require("../controllers/getCatClient")

module.exports = router;
