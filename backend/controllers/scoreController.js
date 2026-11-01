const Score = require('../models/Score');

exports.test = (req, res) => {
  res.json({
    message: 'Controller Working'
  });
};

exports.getAllScores = (req, res) => {
  Score.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getScoreById = (req, res) => {
  Score.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Score not found' });
    res.json(results[0]);
  });
};

exports.createScore = (req, res) => {
  Score.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Score created', score_id: result.insertId });
  });
};

exports.updateScore = (req, res) => {
  Score.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Score not found' });
    res.json({ message: 'Score updated' });
  });
};

exports.deleteScore = (req, res) => {
  Score.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Score not found' });
    res.json({ message: 'Score deleted' });
  });
};