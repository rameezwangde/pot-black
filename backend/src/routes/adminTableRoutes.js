const express = require('express');
const authenticateAdmin = require('../middleware/authenticateAdmin');
const { createTable, deactivateTable, getAdminTables, updateTable, updateTableStatus } = require('../controllers/adminTableController');

const router = express.Router();
router.use(authenticateAdmin);
router.get('/', getAdminTables);
router.post('/', createTable);
router.patch('/:id/status', updateTableStatus);
router.patch('/:id', updateTable);
router.delete('/:id', deactivateTable);

module.exports = router;
