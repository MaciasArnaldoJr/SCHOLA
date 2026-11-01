const express = require('express');
const router = express.Router();

const loadslipController = require('../controllers/loadslipController');

router.post('/', loadslipController.createLoadslip);
router.get('/', loadslipController.getAllLoadslips);
router.get('/:id', loadslipController.getLoadslipById);
router.put('/:id', loadslipController.updateLoadslip);
router.delete('/:id', loadslipController.deleteLoadslip);

module.exports = router;