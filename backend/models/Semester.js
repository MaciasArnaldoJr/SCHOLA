const db = require('../database');

exports.createSemester = (semester, callback) => {
    const sql = `
        INSERT INTO Semester
        (semester_name, academic_year, start_date, end_date, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        semester.semester_name,
        semester.academic_year,
        semester.start_date,
        semester.end_date,
        semester.status
    ], callback);
};

exports.getAllSemesters = (callback) => {
    const sql = 'SELECT s.* FROM Semester AS s';
    db.query(sql, callback);
};

exports.getSemesterById = (id, callback) => {
    const sql = 'SELECT s.* FROM Semester AS s WHERE s.semester_id = ?';
    db.query(sql, [id], callback);
};

exports.updateSemester = (id, semester, callback) => {
    const sql = `
        UPDATE Semester AS s
        SET semester_name = ?, academic_year = ?, start_date = ?,
            end_date = ?, status = ?
        WHERE s.semester_id = ?
    `;

    db.query(sql, [
        semester.semester_name,
        semester.academic_year,
        semester.start_date,
        semester.end_date,
        semester.status,
        id
    ], callback);
};

exports.deleteSemester = (id, callback) => {
    const sql = 'DELETE FROM Semester WHERE semester_id = ?';
    db.query(sql, [id], callback);
};