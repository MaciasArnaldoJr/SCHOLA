const db = require('../database');

exports.getAllSchedules = (req, res) => {
  db.query('SELECT * FROM Schedule', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getScheduleById = (req, res) => {
  db.query('SELECT * FROM Schedule WHERE schedule_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Schedule not found' });
    res.json(results[0]);
  });
};

exports.createSchedule = (req, res) => {
  const { loadslip_id, room_id, day_of_week, start_time, end_time } = req.body;
  db.query(
    'INSERT INTO Schedule (loadslip_id, room_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
    [loadslip_id, room_id, day_of_week, start_time, end_time],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Schedule created', schedule_id: result.insertId });
    }
  );
};

exports.updateSchedule = (req, res) => {
  const { loadslip_id, room_id, day_of_week, start_time, end_time } = req.body;
  db.query(
    'UPDATE Schedule SET loadslip_id = ?, room_id = ?, day_of_week = ?, start_time = ?, end_time = ? WHERE schedule_id = ?',
    [loadslip_id, room_id, day_of_week, start_time, end_time, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Schedule not found' });
      res.json({ message: 'Schedule updated' });
    }
  );
};

exports.deleteSchedule = (req, res) => {
  db.query('DELETE FROM Schedule WHERE schedule_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Schedule not found' });
    res.json({ message: 'Schedule deleted' });
  });
};