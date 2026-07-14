const express = require('express');
const { getAllTables } = require('../controllers/tableController');

const router = express.Router();

router.get('/', getAllTables);

module.exports = router;
