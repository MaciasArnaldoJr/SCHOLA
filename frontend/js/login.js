const loginForm = document.getElementById('loginForm');
const loginInput = document.getElementById('login');
const passwordInput = document.getElementById('password');
const messageBox = document.getElementById('message');

function goToPage(role) {
  if (role === 'Admin') {
    window.location.href = 'user-management.html';
  } else if (role === 'Teacher') {
    window.location.href = 'attendance-dashboard.html';
  } else {
    window.location.href = 'grade-dashboard.html';
  }
}

const savedUser = JSON.parse(sessionStorage.getItem('user'));
if (savedUser) {
  goToPage(savedUser.role);
}

function showError(text) {
  messageBox.textContent = text;
  messageBox.className = 'message error';
}

loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const login = loginInput.value.trim();
  const password = passwordInput.value;

  if (login === '' || password === '') {
    showError('Please fill in both fields.');
    return;
  }

  try {
    const response = await fetch(API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: login, password: password })
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message);
      return;
    }

    sessionStorage.setItem('user', JSON.stringify(data.user));
    goToPage(data.user.role);
  } catch (error) {
    showError('Cannot reach the server. Is the backend running?');
  }
});