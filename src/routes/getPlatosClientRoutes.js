const express = require('express');
const router = express.Router();
const { getPlatosClient} = require('../controllers/getPlatosClient');
// GET /platos/
router.get('/', getPlatosClient);

module.exports = router;
