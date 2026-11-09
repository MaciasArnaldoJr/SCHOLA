const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.loginAdmin = (req, res) => {
    const { login, password } = req.body || {};

    if (!login || !password) {
        return res.status(400).json({
            message: 'Enter your username/email and password.'
        });
    }

    User.findForLogin(login.trim(), (err, results) => {
        if (err) {
            console.error('Admin login lookup error:', err);
            return res.status(500).json({
                message: 'Unable to process login right now.'
            });
        }

        if (!results || results.length === 0) {
            return res.status(401).json({
                message: 'Invalid username/email or password.'
            });
        }

        const user = results[0];

        if (user.role !== 'Admin' || user.account_status !== 'Active') {
            return res.status(403).json({
                message: 'Only active administrator accounts can log in.'
            });
        }

        bcrypt.compare(password, user.password, (compareError, isMatch) => {
            if (compareError) {
                console.error('Password comparison error:', compareError);
                return res.status(500).json({
                    message: 'Unable to verify password.'
                });
            }

            if (!isMatch) {
                return res.status(401).json({
                    message: 'Invalid username/email or password.'
                });
            }

            return res.status(200).json({
                message: 'Login successful.',
                admin: {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        });
    });
};
