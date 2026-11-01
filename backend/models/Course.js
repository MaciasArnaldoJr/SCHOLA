const db = require('../database');

exports.getAll = (callback) => {
  db.query('SELECT * FROM Course', callback);
};

exports.getById = (id, callback) => {
  db.query(
    'SELECT * FROM Course WHERE course_id = ?',
    [id],
    callback
  );
};

exports.create = (data, callback) => {
  const { department_id, course_code, course_name, description } = data;

  db.query(
    'INSERT INTO Course (department_id, course_code, course_name, description) VALUES (?, ?, ?, ?)',
    [department_id, course_code, course_name, description],
    callback
  );
};

exports.update = (id, data, callback) => {
  const { department_id, course_code, course_name, description } = data;

  db.query(
    'UPDATE Course SET department_id = ?, course_code = ?, course_name = ?, description = ? WHERE course_id = ?',
    [department_id, course_code, course_name, description, id],
    callback
  );
};

exports.delete = (id, callback) => {
  db.query(
    'DELETE FROM Course WHERE course_id = ?',
    [id],
    callback
  );
};

// Course JOIN Report
exports.getCourseReport = (callback) => {
  const sql = `
    SELECT
      c.course_id,
      c.course_code,
      c.course_name,
      d.department_code,
      d.department_name,
      y.year_level_name,
      COUNT(s.student_id) AS total_students
    FROM Course AS c
    INNER JOIN Department AS d
      ON c.department_id = d.department_id
    INNER JOIN Students AS s
      ON c.course_id = s.course_id
    INNER JOIN YearLevel AS y
      ON s.year_level_id = y.year_level_id
    GROUP BY
      c.course_id,
      c.course_code,
      c.course_name,
      d.department_code,
      d.department_name,
      y.year_level_id,
      y.year_level_name
  `;

  db.query(sql, callback);
};
