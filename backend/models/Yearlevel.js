const db = require('../database');

exports.getAllYearLevels = (req, res) => {
  db.query('SELECT * FROM YearLevel', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getYearLevelById = (req, res) => {
  db.query('SELECT * FROM YearLevel WHERE year_level_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Year level not found' });
    res.json(results[0]);
  });
};

exports.createYearLevel = (req, res) => {
  const { year_level_name, description } = req.body;
  db.query(
    'INSERT INTO YearLevel (year_level_name, description) VALUES (?, ?)',
    [year_level_name, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Year level created', year_level_id: result.insertId });
    }
  );
};

exports.updateYearLevel = (req, res) => {
  const { year_level_name, description } = req.body;
  db.query(
    'UPDATE YearLevel SET year_level_name = ?, description = ? WHERE year_level_id = ?',
    [year_level_name, description, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Year level not found' });
      res.json({ message: 'Year level updated' });
    }
  );
};

exports.deleteYearLevel = (req, res) => {
  db.query('DELETE FROM YearLevel WHERE year_level_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Year level not found' });
    res.json({ message: 'Year level deleted' });
  });
};