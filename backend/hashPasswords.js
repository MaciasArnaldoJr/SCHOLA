const bcrypt = require('bcryptjs');
const db = require('./database');

db.query('SELECT user_id, password FROM Users', (err, users) => {
  if (err) {
    console.log('Could not read users:', err.message);
    return db.end();
  }

  let left = users.length;
  if (left === 0) {
    console.log('No users found.');
    return db.end();
  }

  users.forEach((u) => {
    if (u.password.startsWith('$2')) {
      console.log('Already hashed:', u.user_id);
      left--;
      if (left === 0) db.end();
      return;
    }

    const hashed = bcrypt.hashSync(u.password, 10);
    db.query('UPDATE Users SET password = ? WHERE user_id = ?', [hashed, u.user_id], (err) => {
      if (err) console.log('Failed for user', u.user_id, err.message);
      else console.log('Hashed password for user', u.user_id);
      left--;
      if (left === 0) db.end();
    });
  });
});