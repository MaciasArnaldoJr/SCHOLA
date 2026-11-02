const Course = require('../models/Course');

exports.getAllCourses = (req, res) => {
  Course.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getCourseById = (req, res) => {
  Course.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Course not found' });
    res.json(results[0]);
  });
};

exports.createCourse = (req, res) => {
  Course.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Course created', course_id: result.insertId });
  });
};

exports.updateCourse = (req, res) => {
  Course.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course updated' });
  });
};

exports.deleteCourse = (req, res) => {
  Course.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  });
};

exports.getCourseReport = (req, res) => {
  Course.getCourseReport((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};