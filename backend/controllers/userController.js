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
      role: role || 'Student',
      account_status: account_status || 'Active'
    }, (err, result) => {
      if (err) {
        console.log(err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'Username or email already exists.' });
        }
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
  const id = req.params.id;

  if (!username || !email) {
    return res.status(400).json({
      message: 'Username and email are required.'
    });
  }

  User.updateUser(id, {
    username,
    email,
    role: role || 'Student',
    account_status: account_status || 'Active'
  }, (err, result) => {
    if (err) {
      console.log(err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Username or email already exists.' });
      }
      return res.status(500).json({ message: 'Failed to update user.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // no new password typed, so we are done
    if (!password) {
      return res.json({ message: 'User updated successfully.' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Password processing failed.' });
      }
      User.updatePassword(id, hashedPassword, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'User updated but password change failed.' });
        }
        res.json({ message: 'User updated successfully.' });
      });
    });
  });
};

exports.deleteUser = (req, res) => {
  User.deleteUser(req.params.id, (err, result) => {
    if (err) {
      console.log(err);
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
          message: 'Cannot delete this user. A student or teacher record still uses it.'
        });
      }
      return res.status(500).json({ message: 'Failed to delete user.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  });
};

exports.getUserReport = (req, res) => {
  User.getUserReport((err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Failed to retrieve user report.' });
    }
    res.json(results);
  });
};