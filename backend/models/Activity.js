const db = require('../database');

const Activity = {
  getAll: (cb) => {
    db.query('SELECT * FROM Activities ORDER BY activity_id DESC', cb);
  },

  getById: (id, cb) => {
    db.query('SELECT * FROM Activities WHERE activity_id = ?', [id], cb);
  },

  create: (data, cb) => {
    db.query(
      `INSERT INTO Activities
       (loadslip_id, activity_title, activity_type, instructions, total_points, date_posted, due_date, status)
       VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)`,
      [
        data.loadslip_id,
        data.activity_title,
        data.activity_type || null,
        data.instructions || null,
        data.total_points,
        data.due_date || null,
        data.status || 'Open'
      ],
      cb
    );
  },

  update: (id, data, cb) => {
    db.query(
      `UPDATE Activities SET
       loadslip_id = ?, activity_title = ?, activity_type = ?, instructions = ?,
       total_points = ?, due_date = ?, status = ?
       WHERE activity_id = ?`,
      [
        data.loadslip_id,
        data.activity_title,
        data.activity_type || null,
        data.instructions || null,
        data.total_points,
        data.due_date || null,
        data.status || 'Open',
        id
      ],
      cb
    );
  },

  delete: (id, cb) => {
    db.query('DELETE FROM Activities WHERE activity_id = ?', [id], cb);
  }
};

exports.getActivityReport = (callback) => {
    const sql = `
        SELECT
            a.activity_id,
            a.activity_name,
            a.description,
            sc.score_id,
            sc.score_value,
            sc.remarks
        FROM Activities AS a
        INNER JOIN Scores AS sc
            ON a.activity_id = sc.activity_id
    `;

    db.query(sql, callback);
};

module.exports = Activity;
