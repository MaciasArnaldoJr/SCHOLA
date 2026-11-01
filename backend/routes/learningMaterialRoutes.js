const express = require('express');
const router = express.Router();
const learningMaterialController = require('../controllers/learningMaterialController');

router.get('/', learningMaterialController.getAllLearningMaterials);
router.get('/:id', learningMaterialController.getLearningMaterialById);
router.post('/', learningMaterialController.createLearningMaterial);
router.put('/:id', learningMaterialController.updateLearningMaterial);
router.delete('/:id', learningMaterialController.deleteLearningMaterial);

module.exports = router;