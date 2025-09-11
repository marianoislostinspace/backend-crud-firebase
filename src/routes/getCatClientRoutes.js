const express = require('express');
const router = express.Router();

const { getCatClient } = require("../controllers/getCatClient");

router.get('/', getCatClient);

module.exports = router;
