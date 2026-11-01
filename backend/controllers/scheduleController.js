const Schedule = require('../models/Schedule');

exports.getAllSchedules = (req, res) => {
  Schedule.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getScheduleById = (req, res) => {
  Schedule.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Schedule not found' });
    res.json(results[0]);
  });
};

exports.createSchedule = (req, res) => {
  Schedule.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Schedule created', schedule_id: result.insertId });
  });
};

exports.updateSchedule = (req, res) => {
  Schedule.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Schedule not found' });
    res.json({ message: 'Schedule updated' });
  });
};

exports.deleteSchedule = (req, res) => {
  Schedule.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Schedule not found' });
    res.json({ message: 'Schedule deleted' });
  });
};

exports.getScheduleReport = (req, res) => {
  Schedule.getReport((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};