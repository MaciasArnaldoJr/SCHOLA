const db = require('../database');

exports.createStudent = (student, callback) => {
    const sql = `
        INSERT INTO Students
        (user_id, course_id, department_id, year_level_id, fname, lname, mname, section, birth_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        student.user_id,
        student.course_id,
        student.department_id,
        student.year_level_id,
        student.fname,
        student.lname,
        student.mname,
        student.section,
        student.birth_date
    ], callback);
};

exports.getAllStudents = (callback) => {
    const sql = 'SELECT s.* FROM Students AS s';

    db.query(sql, callback);
};

exports.getStudentById = (id, callback) => {
    const sql = 'SELECT s.* FROM Students AS s WHERE s.student_id = ?';

    db.query(sql, [id], callback);
};

exports.updateStudent = (id, student, callback) => {
    const sql = `
        UPDATE Students AS s
        SET user_id = ?, course_id = ?, department_id = ?, year_level_id = ?,
            fname = ?, lname = ?, mname = ?, section = ?, birth_date = ?
        WHERE s.student_id = ?
    `;

    db.query(sql, [
        student.user_id,
        student.course_id,
        student.department_id,
        student.year_level_id,
        student.fname,
        student.lname,
        student.mname,
        student.section,
        student.birth_date,
        id
    ], callback);
};

exports.deleteStudent = (id, callback) => {
    const sql = 'DELETE FROM Students WHERE student_id = ?';

    db.query(sql, [id], callback);
};