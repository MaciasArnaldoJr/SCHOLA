const Grade = require('../models/Grade');
 
exports.test = (req, res) => {
  res.json({
    message: 'Controller Working'
  });
};
 
exports.getAllGrades = (req, res) => {
  Grade.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
 
exports.getGradeById = (req, res) => {
  Grade.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Grade not found' });
    res.json(results[0]);
  });
};
 
exports.createGrade = (req, res) => {
  Grade.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Grade created', grade_id: result.insertId });
  });
};
 
exports.updateGrade = (req, res) => {
  Grade.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Grade not found' });
    res.json({ message: 'Grade updated' });
  });
};
 
exports.deleteGrade = (req, res) => {
  Grade.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Grade not found' });
    res.json({ message: 'Grade deleted' });
  });
};

exports.getGradeAttendanceReport = (req, res) => {
    Grade.getGradeAttendanceReport((err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to retrieve grade and attendance report.'
            });
        }

        res.json(results);
    });
};