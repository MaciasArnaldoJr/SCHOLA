const Room = require('../models/Room');

exports.getAllRooms = (req, res) => {
  Room.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getRoomById = (req, res) => {
  Room.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Room not found' });
    res.json(results[0]);
  });
};

exports.createRoom = (req, res) => {
  Room.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Room created', room_id: result.insertId });
  });
};

exports.updateRoom = (req, res) => {
  Room.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room updated' });
  });
};

exports.deleteRoom = (req, res) => {
  Room.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deleted' });
  });
};