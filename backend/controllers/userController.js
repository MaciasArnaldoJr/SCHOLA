const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createUser = (req, res) => {
    const {
        username,
        password,
        email,
        role,
        account_status
    } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({
            message: 'Username, password, and email are required.'
        });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.log('Password hashing error:', err);
            return res.status(500).json({
                message: 'Password processing failed.'
            });
        }

        const userData = {
            username,
            password: hashedPassword,
            email,
            role: role || 'Student',
            account_status: account_status || 'Active'
        };

        User.createUser(userData, (err, result) => {
            if (err) {
                console.log('Create user error:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        message: 'Username or email already exists.'
                    });
                }

                return res.status(500).json({
                    message: 'Failed to create user.'
                });
            }

            return res.status(201).json({
                message: 'User created successfully.',
                user_id: result.insertId
            });
        });
    });
};

exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, results) => {
        if (err) {
            console.log('Get all users error:', err);

            return res.status(500).json({
                message: 'Failed to retrieve users.'
            });
        }

        // Return users as a direct JSON array
        return res.status(200).json(results);
    });
};

exports.getUserById = (req, res) => {
    const id = req.params.id;

    User.getUserById(id, (err, results) => {
        if (err) {
            console.log('Get user error:', err);

            return res.status(500).json({
                message: 'Failed to retrieve user.'
            });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        return res.status(200).json(results[0]);
    });
};

exports.updateUser = (req, res) => {
    const id = req.params.id;

    const {
        username,
        password,
        email,
        role,
        account_status
    } = req.body;

    if (!username || !email) {
        return res.status(400).json({
            message: 'Username and email are required.'
        });
    }

    const userData = {
        username,
        email,
        role: role || 'Student',
        account_status: account_status || 'Active'
    };

    User.updateUser(id, userData, (err, result) => {
        if (err) {
            console.log('Update user error:', err);

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    message: 'Username or email already exists.'
                });
            }

            return res.status(500).json({
                message: 'Failed to update user.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        // If password is empty, keep the existing password
        if (!password) {
            return res.status(200).json({
                message: 'User updated successfully.'
            });
        }

        // Hash the new password before saving
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.log('Password hashing error:', err);

                return res.status(500).json({
                    message: 'Password processing failed.'
                });
            }

            User.updatePassword(id, hashedPassword, (err) => {
                if (err) {
                    console.log('Update password error:', err);

                    return res.status(500).json({
                        message: 'User updated, but password change failed.'
                    });
                }

                return res.status(200).json({
                    message: 'User updated successfully.'
                });
            });
        });
    });
};
exports.deleteUser = (req, res) => {
    const id = req.params.id;

    User.deleteUser(id, (err, result) => {
        if (err) {
            console.log('Delete user error:', err);

            if (
                err.code === 'ER_ROW_IS_REFERENCED_2' ||
                err.code === 'ER_ROW_IS_REFERENCED'
            ) {
                return res.status(409).json({
                    message: 'Cannot delete this user because a student or teacher record still uses it.'
                });
            }

            return res.status(500).json({
                message: 'Failed to delete user.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        return res.status(200).json({
            message: 'User deleted successfully.'
        });
    });
};
exports.getUserReport = (req, res) => {
    User.getUserReport((err, results) => {
        if (err) {
            console.log('Get user report error:', err);

            return res.status(500).json({
                message: 'Failed to retrieve user report.'
            });
        }

        return res.status(200).json(results);
    });
};