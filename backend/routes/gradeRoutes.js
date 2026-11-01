const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/GradeController');

router.get('/test', gradeController.test);
router.get('/', gradeController.getAllGrades);
router.get('/:id', gradeController.getGradeById);
router.post('/', gradeController.createGrade);
router.put('/:id', gradeController.updateGrade);
router.delete('/:id', gradeController.deleteGrade);

module.exports = router;