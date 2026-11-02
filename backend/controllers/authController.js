const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.login = (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Please enter your username or email and password.' });
  }

  User.findForLogin(login.trim(), (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Login failed. Please try again.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username/email or password.' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Login failed. Please try again.' });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username/email or password.' });
      }
      if (user.account_status !== 'Active') {
        return res.status(403).json({ message: 'This account is not active.' });
      }

      // never send the password back
      res.json({
        message: 'Login successful.',
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    });
  });
};