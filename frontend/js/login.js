const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const submitButton = document.getElementById('submitButton');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');

if (togglePassword) {
    togglePassword.addEventListener('click', () => {
        const showing = passwordInput.type === 'text';
        passwordInput.type = showing ? 'password' : 'text';
        togglePassword.textContent = showing ? 'Show' : 'Hide';
    });
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginMessage.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'Signing in...';

    const login = document.getElementById('login').value.trim();
    const password = passwordInput.value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Login failed.');
        }

        localStorage.setItem('scholaAdmin', JSON.stringify(result.admin));
        window.location.href = 'admin-dashboard.html';
    } catch (error) {
        loginMessage.textContent = error.message || 'Could not connect to SCHOLA.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Sign in';
    }
});
