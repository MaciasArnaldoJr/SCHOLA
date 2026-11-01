const db = require('../database');

exports.getAll = (callback) => {
  db.query('SELECT * FROM Department', callback);
};

exports.getById = (id, callback) => {
  db.query(
    'SELECT * FROM Department WHERE department_id = ?',
    [id],
    callback
  );
};

exports.create = (data, callback) => {
  const { department_code, department_name, description } = data;

  db.query(
    'INSERT INTO Department (department_code, department_name, description) VALUES (?, ?, ?)',
    [department_code, department_name, description],
    callback
  );
};

exports.update = (id, data, callback) => {
  const { department_code, department_name, description } = data;

  db.query(
    'UPDATE Department SET department_code = ?, department_name = ?, description = ? WHERE department_id = ?',
    [department_code, department_name, description, id],
    callback
  );
};

exports.delete = (id, callback) => {
  db.query(
    'DELETE FROM Department WHERE department_id = ?',
    [id],
    callback
  );
};
