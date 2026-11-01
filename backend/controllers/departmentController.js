const Department = require('../models/Department');

exports.getAllDepartments = (req, res) => {
  Department.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getDepartmentById = (req, res) => {
  Department.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Department not found' });
    res.json(results[0]);
  });
};

exports.createDepartment = (req, res) => {
  Department.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Department created', department_id: result.insertId });
  });
};

exports.updateDepartment = (req, res) => {
  Department.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department updated' });
  });
};

exports.deleteDepartment = (req, res) => {
  Department.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deleted' });
  });
};