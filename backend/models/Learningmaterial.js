
const db = require('../database');

exports.getAll = (callback) => {
  db.query('SELECT * FROM LearningMaterial', callback);
};

exports.getById = (id, callback) => {
  db.query(
    'SELECT * FROM LearningMaterial WHERE material_id = ?',
    [id],
    callback
  );
};

exports.create = (data, callback) => {
  const {
    subject_id,
    teacher_id,
    material_title,
    description,
    file_url,
    material_type,
    upload_date
  } = data;

  db.query(
    'INSERT INTO LearningMaterial (subject_id, teacher_id, material_title, description, file_url, material_type, upload_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [subject_id, teacher_id, material_title, description, file_url, material_type, upload_date],
    callback
  );
};

exports.update = (id, data, callback) => {
  const {
    subject_id,
    teacher_id,
    material_title,
    description,
    file_url,
    material_type,
    upload_date
  } = data;

  db.query(
    'UPDATE LearningMaterial SET subject_id = ?, teacher_id = ?, material_title = ?, description = ?, file_url = ?, material_type = ?, upload_date = ? WHERE material_id = ?',
    [subject_id, teacher_id, material_title, description, file_url, material_type, upload_date, id],
    callback
  );
};

exports.delete = (id, callback) => {
  db.query(
    'DELETE FROM LearningMaterial WHERE material_id = ?',
    [id],
    callback
  );
};
