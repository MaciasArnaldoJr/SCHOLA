const db = require('../database');

exports.createUser = (user, callback) => {
    const sql = `
        INSERT INTO Users (username, password, email, role, account_status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        user.username,
        user.password,
        user.email,
        user.role,
        user.account_status
    ], callback);
};

exports.getAllUsers = (callback) => {
    const sql = `
        SELECT
            u.user_id,
            u.username,
            u.email,
            u.role,
            u.account_status,
            u.creation_date
        FROM Users AS u
    `;

    db.query(sql, callback);
};

exports.getUserById = (id, callback) => {
    const sql = `
        SELECT
            u.user_id,
            u.username,
            u.email,
            u.role,
            u.account_status,
            u.creation_date
        FROM Users AS u
        WHERE u.user_id = ?
    `;

    db.query(sql, [id], callback);
};

exports.updateUser = (id, user, callback) => {
    const sql = `
        UPDATE Users AS u
        SET username = ?, password = ?, email = ?, role = ?, account_status = ?
        WHERE u.user_id = ?
    `;

    db.query(sql, [
        user.username,
        user.password,
        user.email,
        user.role,
        user.account_status,
        id
    ], callback);
};

exports.deleteUser = (id, callback) => {
    const sql = 'DELETE FROM Users WHERE user_id = ?';

    db.query(sql, [id], callback);
};