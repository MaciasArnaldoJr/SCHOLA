const Activity = require('../models/Activity');

exports.test = (req, res) => {
  res.json({
    message: 'Controller Working'
  });
};

exports.getAllActivities = (req, res) => {
  Activity.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getActivityById = (req, res) => {
  Activity.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Activity not found' });
    res.json(results[0]);
  });
};

exports.createActivity = (req, res) => {
  Activity.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Activity created', activity_id: result.insertId });
  });
};

exports.updateActivity = (req, res) => {
  Activity.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Activity not found' });
    res.json({ message: 'Activity updated' });
  });
};

exports.deleteActivity = (req, res) => {
  Activity.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Activity not found' });
    res.json({ message: 'Activity deleted' });
  });
};