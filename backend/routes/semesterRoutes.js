const express = require('express');
const router = express.Router();

const semesterController = require('../controllers/semesterController');

router.post('/', semesterController.createSemester);
router.get('/', semesterController.getAllSemesters);
router.get('/:id', semesterController.getSemesterById);
router.put('/:id', semesterController.updateSemester);
router.delete('/:id', semesterController.deleteSemester);

module.exports = router;