
const db = require('../database');

exports.getAll = (callback) => {
    db.query('SELECT * FROM Schedule', callback);
};

exports.getById = (id, callback) => {
    db.query(
        'SELECT * FROM Schedule WHERE schedule_id = ?',
        [id],
        callback
    );
};

exports.create = (data, callback) => {
    const { loadslip_id, room_id, day_of_week, start_time, end_time } = data;

    db.query(
        'INSERT INTO Schedule (loadslip_id, room_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
        [loadslip_id, room_id, day_of_week, start_time, end_time],
        callback
    );
};

exports.update = (id, data, callback) => {
    const { loadslip_id, room_id, day_of_week, start_time, end_time } = data;

    db.query(
        'UPDATE Schedule SET loadslip_id = ?, room_id = ?, day_of_week = ?, start_time = ?, end_time = ? WHERE schedule_id = ?',
        [loadslip_id, room_id, day_of_week, start_time, end_time, id],
        callback
    );
};

exports.delete = (id, callback) => {
    db.query(
        'DELETE FROM Schedule WHERE schedule_id = ?',
        [id],
        callback
    );
};

exports.getScheduleReport = (callback) => {
    const sql = `
        SELECT
            sc.schedule_id,
            sc.day_of_week,
            sc.start_time,
            sc.end_time,
            sl.loadslip_id,
            sub.subject_code,
            sub.subject_name,
            t.fname AS teacher_fname,
            t.lname AS teacher_lname,
            r.room_name,
            r.building
        FROM Schedule AS sc
        INNER JOIN Loadslip AS sl
            ON sc.loadslip_id = sl.loadslip_id
        INNER JOIN Subjects AS sub
            ON sl.subject_id = sub.subject_id
        INNER JOIN Teachers AS t
            ON sl.teacher_id = t.teacher_id
        INNER JOIN Room AS r
            ON sc.room_id = r.room_id
    `;

    db.query(sql, callback);
};
