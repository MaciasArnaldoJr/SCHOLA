const db = require('../database');

exports.getAllLearningMaterials = (req, res) => {
  db.query('SELECT * FROM LearningMaterial', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getLearningMaterialById = (req, res) => {
  db.query('SELECT * FROM LearningMaterial WHERE material_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Learning material not found' });
    res.json(results[0]);
  });
};

exports.createLearningMaterial = (req, res) => {
  const { subject_id, teacher_id, material_title, description, file_url, material_type, upload_date } = req.body;
  db.query(
    'INSERT INTO LearningMaterial (subject_id, teacher_id, material_title, description, file_url, material_type, upload_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [subject_id, teacher_id, material_title, description, file_url, material_type, upload_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Learning material created', material_id: result.insertId });
    }
  );
};

exports.updateLearningMaterial = (req, res) => {
  const { subject_id, teacher_id, material_title, description, file_url, material_type, upload_date } = req.body;
  db.query(
    'UPDATE LearningMaterial SET subject_id = ?, teacher_id = ?, material_title = ?, description = ?, file_url = ?, material_type = ?, upload_date = ? WHERE material_id = ?',
    [subject_id, teacher_id, material_title, description, file_url, material_type, upload_date, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Learning material not found' });
      res.json({ message: 'Learning material updated' });
    }
  );
};

exports.deleteLearningMaterial = (req, res) => {
  db.query('DELETE FROM LearningMaterial WHERE material_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Learning material not found' });
    res.json({ message: 'Learning material deleted' });
  });
};