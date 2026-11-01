const db = require('../database');

exports.createTeacher = (teacher, callback) => {
    const sql = `
        INSERT INTO Teachers
        (user_id, department_id, fname, lname, mname, email, specialization)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        teacher.user_id,
        teacher.department_id,
        teacher.fname,
        teacher.lname,
        teacher.mname,
        teacher.email,
        teacher.specialization
    ], callback);
};

exports.getAllTeachers = (callback) => {
    const sql = 'SELECT t.* FROM Teachers AS t';

    db.query(sql, callback);
};

exports.getTeacherById = (id, callback) => {
    const sql = 'SELECT t.* FROM Teachers AS t WHERE t.teacher_id = ?';

    db.query(sql, [id], callback);
};

exports.updateTeacher = (id, teacher, callback) => {
    const sql = `
        UPDATE Teachers AS t
        SET user_id = ?, department_id = ?, fname = ?, lname = ?,
            mname = ?, email = ?, specialization = ?
        WHERE t.teacher_id = ?
    `;

    db.query(sql, [
        teacher.user_id,
        teacher.department_id,
        teacher.fname,
        teacher.lname,
        teacher.mname,
        teacher.email,
        teacher.specialization,
        id
    ], callback);
};

exports.deleteTeacher = (id, callback) => {
    const sql = 'DELETE FROM Teachers WHERE teacher_id = ?';

    db.query(sql, [id], callback);
};
