const db = require('../database');

exports.getAllRooms = (req, res) => {
  db.query('SELECT * FROM Room', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getRoomById = (req, res) => {
  db.query('SELECT * FROM Room WHERE room_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Room not found' });
    res.json(results[0]);
  });
};

exports.createRoom = (req, res) => {
  const { room_name, building, room_type, capacity, room_status } = req.body;
  db.query(
    'INSERT INTO Room (room_name, building, room_type, capacity, room_status) VALUES (?, ?, ?, ?, ?)',
    [room_name, building, room_type, capacity, room_status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Room created', room_id: result.insertId });
    }
  );
};

exports.updateRoom = (req, res) => {
  const { room_name, building, room_type, capacity, room_status } = req.body;
  db.query(
    'UPDATE Room SET room_name = ?, building = ?, room_type = ?, capacity = ?, room_status = ? WHERE room_id = ?',
    [room_name, building, room_type, capacity, room_status, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Room not found' });
      res.json({ message: 'Room updated' });
    }
  );
};

exports.deleteRoom = (req, res) => {
  db.query('DELETE FROM Room WHERE room_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deleted' });
  });
};