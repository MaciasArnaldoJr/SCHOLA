const YearLevel = require('../models/Yearlevel');

exports.getAllYearLevels = (req, res) => {
  YearLevel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getYearLevelById = (req, res) => {
  YearLevel.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Year level not found' });
    res.json(results[0]);
  });
};

exports.createYearLevel = (req, res) => {
  YearLevel.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Year level created', year_level_id: result.insertId });
  });
};

exports.updateYearLevel = (req, res) => {
  YearLevel.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Year level not found' });
    res.json({ message: 'Year level updated' });
  });
};

exports.deleteYearLevel = (req, res) => {
  YearLevel.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Year level not found' });
    res.json({ message: 'Year level deleted' });
  });
};