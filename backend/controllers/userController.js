const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createUser = (req, res) => {
    const { username, password, email, role, account_status } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({
            message: 'Username, password, and email are required.'
        });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Password processing failed.' });
        }

        User.createUser({
            username,
            password: hashedPassword,
            email,
            role: role || null,
            account_status: account_status || null
        }, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Failed to create user.' });
            }

            res.status(201).json({
                message: 'User created successfully.',
                user_id: result.insertId
            });
        });
    });
};

exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to retrieve users.' });
        }

        res.json(results);
    });
};

exports.getUserById = (req, res) => {
    User.getUserById(req.params.id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to retrieve user.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(results[0]);
    });
};

exports.updateUser = (req, res) => {
    const { username, password, email, role, account_status } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({
            message: 'Username, password, and email are required.'
        });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Password processing failed.' });
        }

        User.updateUser(req.params.id, {
            username,
            password: hashedPassword,
            email,
            role: role || null,
            account_status: account_status || null
        }, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Failed to update user.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found or no changes made.' });
            }

            res.json({ message: 'User updated successfully.' });
        });
    });
};

exports.deleteUser = (req, res) => {
    User.deleteUser(req.params.id, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to delete user.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'User deleted successfully.' });
    });
};