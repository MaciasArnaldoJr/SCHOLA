const Attendance = require('../models/Attendance');
 
exports.test = (req, res) => {
  res.json({
    message: 'Controller Working'
  });
};
 
exports.getAllAttendance = (req, res) => {
  Attendance.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
 
exports.getAttendanceById = (req, res) => {
  Attendance.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Attendance not found' });
    res.json(results[0]);
  });
};
 
exports.createAttendance = (req, res) => {
  Attendance.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Attendance created', attendance_id: result.insertId });
  });
};
 
exports.updateAttendance = (req, res) => {
  Attendance.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Attendance not found' });
    res.json({ message: 'Attendance updated' });
  });
};
 
exports.deleteAttendance = (req, res) => {
  Attendance.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Attendance not found' });
    res.json({ message: 'Attendance deleted' });
  });
};