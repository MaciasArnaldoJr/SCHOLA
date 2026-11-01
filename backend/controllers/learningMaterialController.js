const LearningMaterial = require('../models/Learningmaterial');

exports.getAllLearningMaterials = (req, res) => {
  LearningMaterial.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getLearningMaterialById = (req, res) => {
  LearningMaterial.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Learning material not found' });
    res.json(results[0]);
  });
};

exports.createLearningMaterial = (req, res) => {
  LearningMaterial.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Learning material created', material_id: result.insertId });
  });
};

exports.updateLearningMaterial = (req, res) => {
  LearningMaterial.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Learning material not found' });
    res.json({ message: 'Learning material updated' });
  });
};

exports.deleteLearningMaterial = (req, res) => {
  LearningMaterial.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Learning material not found' });
    res.json({ message: 'Learning material deleted' });
  });
};