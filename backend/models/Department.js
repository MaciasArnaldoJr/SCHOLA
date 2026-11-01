const db = require('../database');

exports.getAllDepartments = (req, res) => {
  db.query('SELECT * FROM Department', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getDepartmentById = (req, res) => {
  db.query('SELECT * FROM Department WHERE department_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Department not found' });
    res.json(results[0]);
  });
};

exports.createDepartment = (req, res) => {
  const { department_code, department_name, description } = req.body;
  db.query(
    'INSERT INTO Department (department_code, department_name, description) VALUES (?, ?, ?)',
    [department_code, department_name, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Department created', department_id: result.insertId });
    }
  );
};

exports.updateDepartment = (req, res) => {
  const { department_code, department_name, description } = req.body;
  db.query(
    'UPDATE Department SET department_code = ?, department_name = ?, description = ? WHERE department_id = ?',
    [department_code, department_name, description, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Department not found' });
      res.json({ message: 'Department updated' });
    }
  );
};

exports.deleteDepartment = (req, res) => {
  db.query('DELETE FROM Department WHERE department_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deleted' });
  });
};