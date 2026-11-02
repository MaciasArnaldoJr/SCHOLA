const loggedUser = JSON.parse(sessionStorage.getItem('user'));

if (!loggedUser || loggedUser.role !== 'Admin') {
  window.location.href = 'login.html';
}

const welcome = document.getElementById('welcome');
const userTable = document.getElementById('userTable');
const searchInput = document.getElementById('search');
const pageMessage = document.getElementById('pageMessage');

const overlay = document.getElementById('overlay');
const modalTitle = document.getElementById('modalTitle');
const userForm = document.getElementById('userForm');
const formMessage = document.getElementById('formMessage');
const passwordHint = document.getElementById('passwordHint');

const userIdInput = document.getElementById('userId');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const roleInput = document.getElementById('role');
const statusInput = document.getElementById('status');

let allUsers = [];

welcome.textContent = 'Logged in as ' + loggedUser.username;

function showPageMessage(text, type) {
  pageMessage.textContent = text;
  pageMessage.className = 'message ' + type;
}

function showFormError(text) {
  formMessage.textContent = text;
  formMessage.className = 'message error';
}

async function loadUsers() {
  try {
    const response = await fetch(API_URL + '/users');
    const data = await response.json();

    if (!response.ok) {
      showPageMessage(data.message, 'error');
      return;
    }

    allUsers = data;
    showUsers(allUsers);
  } catch (error) {
    showPageMessage('Cannot reach the server. Is the backend running?', 'error');
  }
}

function showUsers(users) {
  userTable.innerHTML = '';

  if (users.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 7;
    cell.textContent = 'No users found.';
    row.appendChild(cell);
    userTable.appendChild(row);
    return;
  }

  users.forEach(function (user) {
    const row = document.createElement('tr');

    const values = [
      user.user_id,
      user.username,
      user.email,
      user.role,
      user.account_status,
      user.creation_date ? user.creation_date.substring(0, 10) : ''
    ];

    values.forEach(function (value, index) {
      const cell = document.createElement('td');
      cell.textContent = value;
      if (index === 4) {
        cell.className = value === 'Active' ? 'status-active' : 'status-inactive';
      }
      row.appendChild(cell);
    });

    const actions = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn-small';
    editBtn.addEventListener('click', function () {
      openForm(user);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'btn-small btn-delete';
    deleteBtn.addEventListener('click', function () {
      deleteUser(user);
    });

    actions.appendChild(editBtn);
    actions.appendChild(document.createTextNode(' '));
    actions.appendChild(deleteBtn);
    row.appendChild(actions);

    userTable.appendChild(row);
  });
}

searchInput.addEventListener('input', function () {
  const text = searchInput.value.toLowerCase();

  const filtered = allUsers.filter(function (user) {
    return (
      user.username.toLowerCase().includes(text) ||
      user.email.toLowerCase().includes(text) ||
      (user.role || '').toLowerCase().includes(text)
    );
  });

  showUsers(filtered);
});

function openForm(user) {
  formMessage.className = 'message';
  userForm.reset();

  if (user) {
    // edit mode
    modalTitle.textContent = 'Edit user';
    userIdInput.value = user.user_id;
    usernameInput.value = user.username;
    emailInput.value = user.email;
    roleInput.value = user.role;
    statusInput.value = user.account_status;
    passwordHint.textContent = 'Leave blank to keep the current password.';
  } else {
    // add mode
    modalTitle.textContent = 'Add user';
    userIdInput.value = '';
    passwordHint.textContent = '';
  }

  overlay.classList.add('show');
}

function closeForm() {
  overlay.classList.remove('show');
}

document.getElementById('addBtn').addEventListener('click', function () {
  openForm(null);
});

document.getElementById('cancelBtn').addEventListener('click', closeForm);

userForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const id = userIdInput.value;
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (username === '' || email === '') {
    showFormError('Username and email are required.');
    return;
  }
  if (!email.includes('@')) {
    showFormError('Please enter a valid email.');
    return;
  }
  if (id === '' && password === '') {
    showFormError('Password is required for a new user.');
    return;
  }
  if (password !== '' && password.length < 6) {
    showFormError('Password must be at least 6 characters.');
    return;
  }

  const body = {
    username: username,
    email: email,
    role: roleInput.value,
    account_status: statusInput.value
  };

  if (password !== '') {
    body.password = password;
  }

  let url = API_URL + '/users';
  let method = 'POST';
  if (id !== '') {
    url = API_URL + '/users/' + id;
    method = 'PUT';
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      showFormError(data.message);
      return;
    }

    closeForm();
    showPageMessage(data.message, 'success');
    loadUsers();
  } catch (error) {
    showFormError('Cannot reach the server. Is the backend running?');
  }
});

async function deleteUser(user) {
  // don't let the admin delete their own account
  if (user.user_id === loggedUser.user_id) {
    showPageMessage('You cannot delete the account you are logged in with.', 'error');
    return;
  }

  if (!confirm('Delete user "' + user.username + '"?')) {
    return;
  }

  try {
    const response = await fetch(API_URL + '/users/' + user.user_id, {
      method: 'DELETE'
    });
    const data = await response.json();

    if (!response.ok) {
      showPageMessage(data.message, 'error');
      return;
    }

    showPageMessage(data.message, 'success');
    loadUsers();
  } catch (error) {
    showPageMessage('Cannot reach the server. Is the backend running?', 'error');
  }
}

document.getElementById('logoutBtn').addEventListener('click', function () {
  sessionStorage.removeItem('user');
  window.location.href = 'login.html';
});

loadUsers();