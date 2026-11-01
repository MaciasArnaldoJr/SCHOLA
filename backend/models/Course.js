const db = require('../database');

exports.getAllCourses = (req, res) => {
  db.query('SELECT * FROM Course', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getCourseById = (req, res) => {
  db.query('SELECT * FROM Course WHERE course_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Course not found' });
    res.json(results[0]);
  });
};

exports.createCourse = (req, res) => {
  const { department_id, course_code, course_name, description } = req.body;
  db.query(
    'INSERT INTO Course (department_id, course_code, course_name, description) VALUES (?, ?, ?, ?)',
    [department_id, course_code, course_name, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Course created', course_id: result.insertId });
    }
  );
};

exports.updateCourse = (req, res) => {
  const { department_id, course_code, course_name, description } = req.body;
  db.query(
    'UPDATE Course SET department_id = ?, course_code = ?, course_name = ?, description = ? WHERE course_id = ?',
    [department_id, course_code, course_name, description, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Course not found' });
      res.json({ message: 'Course updated' });
    }
  );
};

exports.deleteCourse = (req, res) => {
  db.query('DELETE FROM Course WHERE course_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  });
};

exports.getCourseReport = (req, res) => {
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
    INNER JOIN Department AS d ON c.department_id = d.department_id
    INNER JOIN Students AS s ON c.course_id = s.course_id
    INNER JOIN YearLevel AS y ON s.year_level_id = y.year_level_id
    GROUP BY c.course_id, c.course_code, c.course_name,
             d.department_code, d.department_name, y.year_level_id, y.year_level_name
  `;
 
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};