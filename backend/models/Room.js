
const db = require('../database');

exports.getAll = (callback) => {
  db.query('SELECT * FROM Room', callback);
};

exports.getById = (id, callback) => {
  db.query(
    'SELECT * FROM Room WHERE room_id = ?',
    [id],
    callback
  );
};

exports.create = (data, callback) => {
  const { room_name, building, room_type, capacity, room_status } = data;

  db.query(
    'INSERT INTO Room (room_name, building, room_type, capacity, room_status) VALUES (?, ?, ?, ?, ?)',
    [room_name, building, room_type, capacity, room_status],
    callback
  );
};

exports.update = (id, data, callback) => {
  const { room_name, building, room_type, capacity, room_status } = data;

  db.query(
    'UPDATE Room SET room_name = ?, building = ?, room_type = ?, capacity = ?, room_status = ? WHERE room_id = ?',
    [room_name, building, room_type, capacity, room_status, id],
    callback
  );
};

exports.delete = (id, callback) => {
  db.query(
    'DELETE FROM Room WHERE room_id = ?',
    [id],
    callback
  );
};
