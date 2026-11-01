const express = require('express');
const router = express.Router();
const yearLevelController = require('../controllers/yearlevelController');

router.get('/', yearLevelController.getAllYearLevels);
router.get('/:id', yearLevelController.getYearLevelById);
router.post('/', yearLevelController.createYearLevel);
router.put('/:id', yearLevelController.updateYearLevel);
router.delete('/:id', yearLevelController.deleteYearLevel);

module.exports = router;