const db = require('../database');

const Score = {
  getAll: (cb) => {
    db.query(
      `SELECT sc.*, a.activity_title, a.activity_type, a.total_points,
              CONCAT(s.fname, ' ', s.lname) AS student_name
       FROM Scores sc
       JOIN Activities a ON sc.activity_id = a.activity_id
       JOIN Students s ON sc.student_id = s.student_id
       ORDER BY sc.score_id DESC`,
      cb
    );
  },

  getById: (id, cb) => {
    db.query(
      `SELECT sc.*, a.activity_title, a.activity_type, a.total_points,
              CONCAT(s.fname, ' ', s.lname) AS student_name
       FROM Scores sc
       JOIN Activities a ON sc.activity_id = a.activity_id
       JOIN Students s ON sc.student_id = s.student_id
       WHERE sc.score_id = ?`,
      [id],
      cb
    );
  },

  create: (data, cb) => {
    db.query(
      `INSERT INTO Scores
       (activity_id, student_id, points_earned, graded_by, remarks, date_graded)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        data.activity_id,
        data.student_id,
        data.points_earned,
        data.graded_by || null,
        data.remarks || null
      ],
      cb
    );
  },

  update: (id, data, cb) => {
    db.query(
      `UPDATE Scores SET
       points_earned = ?, graded_by = ?, remarks = ?, date_graded = NOW()
       WHERE score_id = ?`,
      [
        data.points_earned,
        data.graded_by || null,
        data.remarks || null,
        id
      ],
      cb
    );
  },

  delete: (id, cb) => {
    db.query('DELETE FROM Scores WHERE score_id = ?', [id], cb);
  }
};

module.exports = Score;