const db = require('../database');
 
const Attendance = {
  getAll: (cb) => {
    db.query('SELECT * FROM Attendance', cb);
  },
 
  getById: (id, cb) => {
    db.query('SELECT * FROM Attendance WHERE attendance_id = ?', [id], cb);
  },
 
  create: (data, cb) => {
    db.query(
      `INSERT INTO Attendance
       (loadslip_id, student_id, attendance_date, attendance_status, recorded_by, remarks)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.loadslip_id,
        data.student_id,
        data.attendance_date,
        data.attendance_status,
        data.recorded_by,
        data.remarks
      ],
      cb
    );
  },
 
  update: (id, data, cb) => {
    db.query(
      `UPDATE Attendance SET
       loadslip_id = ?, student_id = ?, attendance_date = ?,
       attendance_status = ?, recorded_by = ?, remarks = ?
       WHERE attendance_id = ?`,
      [
        data.loadslip_id,
        data.student_id,
        data.attendance_date,
        data.attendance_status,
        data.recorded_by,
        data.remarks,
        id
      ],
      cb
    );
  },
 
  delete: (id, cb) => {
    db.query('DELETE FROM Attendance WHERE attendance_id = ?', [id], cb);
  }
};
 
module.exports = Attendance;