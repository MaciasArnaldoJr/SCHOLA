const db = require('../database');
 
const Grade = {
  getAll: (cb) => {
    db.query('SELECT * FROM Grade', cb);
  },
 
  getById: (id, cb) => {
    db.query('SELECT * FROM Grade WHERE grade_id = ?', [id], cb);
  },
 
  create: (data, cb) => {
    db.query(
      `INSERT INTO Grade
       (loadslip_id, student_id, prelim_grade, midterm_grade, final_grade, overall_grade, remarks, date_updated)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        data.loadslip_id,
        data.student_id,
        data.prelim_grade,
        data.midterm_grade,
        data.final_grade,
        data.overall_grade,
        data.remarks
      ],
      cb
    );
  },
 
  update: (id, data, cb) => {
    db.query(
      `UPDATE Grade SET
       loadslip_id = ?, student_id = ?, prelim_grade = ?, midterm_grade = ?,
       final_grade = ?, overall_grade = ?, remarks = ?, date_updated = NOW()
       WHERE grade_id = ?`,
      [
        data.loadslip_id,
        data.student_id,
        data.prelim_grade,
        data.midterm_grade,
        data.final_grade,
        data.overall_grade,
        data.remarks,
        id
      ],
      cb
    );
  },
 
  delete: (id, cb) => {
    db.query('DELETE FROM Grade WHERE grade_id = ?', [id], cb);
  }
};

 exports.getGradeAttendanceReport = (callback) => {
    const sql = `
        SELECT
            g.grade_id,
            g.student_id,
            g.subject_id,
            g.grade_value,
            g.grade_status,
            a.attendance_id,
            a.attendance_date,
            a.attendance_status
        FROM Grade AS g
        INNER JOIN Attendance AS a
            ON g.student_id = a.student_id
            AND g.subject_id = a.subject_id
    `;

    db.query(sql, callback);
};

module.exports = Grade;
 