const db = require('../database');

exports.createSubject = (subject, callback) => {
    const sql = `
        INSERT INTO Subjects
        (department_id, subject_code, subject_name, description, units)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        subject.department_id,
        subject.subject_code,
        subject.subject_name,
        subject.description,
        subject.units
    ], callback);
};

exports.getAllSubjects = (callback) => {
    const sql = 'SELECT s.* FROM Subjects AS s';
    db.query(sql, callback);
};

exports.getSubjectById = (id, callback) => {
    const sql = 'SELECT s.* FROM Subjects AS s WHERE s.subject_id = ?';
    db.query(sql, [id], callback);
};

exports.updateSubject = (id, subject, callback) => {
    const sql = `
        UPDATE Subjects AS s
        SET department_id = ?, subject_code = ?, subject_name = ?,
            description = ?, units = ?
        WHERE s.subject_id = ?
    `;

    db.query(sql, [
        subject.department_id,
        subject.subject_code,
        subject.subject_name,
        subject.description,
        subject.units,
        id
    ], callback);
};

exports.deleteSubject = (id, callback) => {
    const sql = 'DELETE FROM Subjects WHERE subject_id = ?';
    db.query(sql, [id], callback);
};