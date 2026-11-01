const db = require('../database');

exports.getAll = (callback) => {
  db.query('SELECT * FROM YearLevel', callback);
};

exports.getById = (id, callback) => {
  db.query(
    'SELECT * FROM YearLevel WHERE year_level_id = ?',
    [id],
    callback
  );
};

exports.create = (data, callback) => {
  const { year_level_name, description } = data;

  db.query(
    'INSERT INTO YearLevel (year_level_name, description) VALUES (?, ?)',
    [year_level_name, description],
    callback
  );
};

exports.update = (id, data, callback) => {
  const { year_level_name, description } = data;

  db.query(
    'UPDATE YearLevel SET year_level_name = ?, description = ? WHERE year_level_id = ?',
    [year_level_name, description, id],
    callback
  );
};

exports.delete = (id, callback) => {
  db.query(
    'DELETE FROM YearLevel WHERE year_level_id = ?',
    [id],
    callback
  );
};
