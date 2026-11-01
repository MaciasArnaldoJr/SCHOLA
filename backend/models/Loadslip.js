const db = require('../database');

exports.createLoadslip = (loadslip, callback) => {
    const sql = `
        INSERT INTO Loadslip
        (student_id, subject_id, teacher_id, semester_id, year_level_id,
         course_id, school_year, section, enrollment_status, date_enrolled)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        loadslip.student_id,
        loadslip.subject_id,
        loadslip.teacher_id,
        loadslip.semester_id,
        loadslip.year_level_id,
        loadslip.course_id,
        loadslip.school_year,
        loadslip.section,
        loadslip.enrollment_status,
        loadslip.date_enrolled
    ], callback);
};

exports.getAllLoadslips = (callback) => {
    const sql = 'SELECT l.* FROM Loadslip AS l';
    db.query(sql, callback);
};

exports.getLoadslipById = (id, callback) => {
    const sql = 'SELECT l.* FROM Loadslip AS l WHERE l.loadslip_id = ?';
    db.query(sql, [id], callback);
};

exports.updateLoadslip = (id, loadslip, callback) => {
    const sql = `
        UPDATE Loadslip AS l
        SET student_id = ?, subject_id = ?, teacher_id = ?, semester_id = ?,
            year_level_id = ?, course_id = ?, school_year = ?, section = ?,
            enrollment_status = ?, date_enrolled = ?
        WHERE l.loadslip_id = ?
    `;

    db.query(sql, [
        loadslip.student_id,
        loadslip.subject_id,
        loadslip.teacher_id,
        loadslip.semester_id,
        loadslip.year_level_id,
        loadslip.course_id,
        loadslip.school_year,
        loadslip.section,
        loadslip.enrollment_status,
        loadslip.date_enrolled,
        id
    ], callback);
};

exports.deleteLoadslip = (id, callback) => {
    const sql = 'DELETE FROM Loadslip WHERE loadslip_id = ?';
    db.query(sql, [id], callback);
};