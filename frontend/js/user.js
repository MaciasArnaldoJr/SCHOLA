const API_URL = 'http://localhost:3000/api';

const usersTableBody = document.getElementById('usersTableBody');

const userSearch = document.getElementById('userSearch');

const totalUsers = document.getElementById('totalUsers');
const activeUsers = document.getElementById('activeUsers');
const inactiveUsers = document.getElementById('inactiveUsers');

const pageMessage = document.getElementById('pageMessage');

const userModal = document.getElementById('userModal');
const modalTitle = document.getElementById('modalTitle');

const userForm = document.getElementById('userForm');
const formMessage = document.getElementById('formMessage');

const userId = document.getElementById('userId');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const role = document.getElementById('role');
const accountStatus = document.getElementById('accountStatus');

const passwordNote = document.getElementById('passwordNote');

const addUserBtn = document.getElementById('addUserBtn');
const cancelUserBtn = document.getElementById('cancelUserBtn');
const saveUserBtn = document.getElementById('saveUserBtn');

const refreshUsersBtn = document.getElementById('refreshUsersBtn');
const printUsersBtn = document.getElementById('printUsersBtn');
const backDashboardBtn = document.getElementById('backDashboardBtn');

let users = [];

async function fetchAPI(endpoint, options = {}) {

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers
        }
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.error ||
            `Backend error: ${response.status}`
        );
    }

    return result;
}

function getArray(result, key) {

    if (Array.isArray(result)) {
        return result;
    }

    if (Array.isArray(result?.data)) {
        return result.data;
    }

    if (Array.isArray(result?.[key])) {
        return result[key];
    }

    return [];
}

function escapeHTML(value) {

    return String(value ?? '').replace(/[&<>"']/g, character => {

        const replacements = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return replacements[character];
    });
}

function normalizeValue(value) {
    return String(value ?? '').trim().toLowerCase();
}

function getRoleClass(userRole) {

    const value = normalizeValue(userRole);

    if (value === 'admin') return 'role-admin';
    if (value === 'teacher') return 'role-teacher';
    if (value === 'student') return 'role-student';

    return '';
}

function getStatusClass(status) {

    const value = normalizeValue(status);

    if (value === 'active') return 'status-active';
    if (value === 'inactive') return 'status-inactive';

    return '';
}

function showMessage(element, message, type = 'success') {

    element.textContent = message;
    element.className = `users-message ${type}`;

}

function clearMessage(element) {

    element.textContent = '';
    element.className = 'users-message';

}

function formatDate(dateValue) {

    if (!dateValue) return 'N/A';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return escapeHTML(dateValue);
    }

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function updateStatistics(data) {

    totalUsers.textContent = data.length;

    const active = data.filter(user =>
        normalizeValue(user.account_status) === 'active'
    ).length;

    const inactive = data.filter(user =>
        normalizeValue(user.account_status) === 'inactive'
    ).length;

    activeUsers.textContent = active;
    inactiveUsers.textContent = inactive;

}

async function loadUsers() {

    usersTableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center;padding:30px;">
                Loading user records...
            </td>
        </tr>
    `;

    clearMessage(pageMessage);

    try {

        const result = await fetchAPI('/users');

        users = getArray(result, 'users');

        updateStatistics(users);

        renderUsers(users);

        console.log('Users retrieved from database:', users);

    } catch (error) {

        console.error('User loading error:', error);

        users = [];

        updateStatistics([]);

        usersTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:30px;">
                    Unable to retrieve user records.
                </td>
            </tr>
        `;

        showMessage(
            pageMessage,
            'User loading failed: ' + error.message,
            'error'
        );

    }

}

function renderUsers(data) {

    if (data.length === 0) {

        usersTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:30px;">
                    No user records found.
                </td>
            </tr>
        `;

        return;
    }

    usersTableBody.innerHTML = data.map(user => {

        const id = escapeHTML(user.user_id);
        const userRole = escapeHTML(user.role || 'N/A');
        const status = escapeHTML(user.account_status || 'N/A');

        return `
            <tr>

                <td>${id}</td>

                <td>${escapeHTML(user.username)}</td>

                <td>${escapeHTML(user.email)}</td>

                <td>
                    <span class="user-badge ${getRoleClass(user.role)}">
                        ${userRole}
                    </span>
                </td>

                <td>
                    <span class="user-badge ${getStatusClass(user.account_status)}">
                        ${status}
                    </span>
                </td>

                <td>${formatDate(user.creation_date)}</td>

                <td class="no-print">

                    <button
                        type="button"
                        class="user-action edit-user"
                        data-action="edit"
                        data-id="${id}">
                        Edit
                    </button>

                    <button
                        type="button"
                        class="user-action delete-user"
                        data-action="delete"
                        data-id="${id}">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    }).join('');

}

userSearch.addEventListener('input', function() {

    const searchValue = normalizeValue(this.value);

    const filteredUsers = users.filter(user => {

        return (
            String(user.user_id ?? '').toLowerCase().includes(searchValue) ||
            normalizeValue(user.username).includes(searchValue) ||
            normalizeValue(user.email).includes(searchValue) ||
            normalizeValue(user.role).includes(searchValue) ||
            normalizeValue(user.account_status).includes(searchValue)
        );

    });

    renderUsers(filteredUsers);

});

function openAddModal() {

    userForm.reset();

    userId.value = '';

    modalTitle.textContent = 'Add User';

    saveUserBtn.textContent = 'Save User';

    password.required = true;

    passwordNote.textContent =
        'Required when creating a new account.';

    clearMessage(formMessage);

    userModal.classList.add('open');

}

function openEditModal(id) {

    const user = users.find(item =>
        String(item.user_id) === String(id)
    );

    if (!user) {

        showMessage(
            pageMessage,
            'User record not found.',
            'error'
        );

        return;
    }

    userForm.reset();

    userId.value = user.user_id;

    username.value = user.username ?? '';
    email.value = user.email ?? '';
    role.value = user.role ?? 'Student';

    const currentStatus = normalizeValue(user.account_status);

    accountStatus.value =
        currentStatus === 'inactive' ? 'Inactive' : 'Active';

    password.value = '';

    password.required = false;

    passwordNote.textContent =
        'Leave blank to keep the current password.';

    modalTitle.textContent = 'Edit User';

    saveUserBtn.textContent = 'Update User';

    clearMessage(formMessage);

    userModal.classList.add('open');

}

function closeModal() {

    userModal.classList.remove('open');

    userForm.reset();

    password.required = false;

    clearMessage(formMessage);

}

userForm.addEventListener('submit', async function(event) {

    event.preventDefault();

    const id = userId.value;

    const userData = {

        username: username.value.trim(),

        email: email.value.trim(),

        role: role.value,

        account_status: accountStatus.value

    };

    const passwordValue = password.value.trim();

    if (
        !userData.username ||
        !userData.email ||
        !userData.role ||
        !userData.account_status
    ) {

        showMessage(
            formMessage,
            'Please complete all required fields.',
            'error'
        );

        return;
    }

    if (!id && !passwordValue) {

        showMessage(
            formMessage,
            'Please enter a password for the new account.',
            'error'
        );

        return;
    }

    if (passwordValue && passwordValue.length < 6) {

        showMessage(
            formMessage,
            'Password must contain at least 6 characters.',
            'error'
        );

        return;
    }

    saveUserBtn.disabled = true;

    saveUserBtn.textContent = id ? 'Updating...' : 'Saving...';

    try {

        if (id) {

      
            await fetchAPI(`/users/${encodeURIComponent(id)}`, {

                method: 'PUT',

                body: JSON.stringify({
                    ...userData,
                    ...(passwordValue ? { password: passwordValue } : {})
                })

            });

            showMessage(
                pageMessage,
                'User updated successfully!',
                'success'
            );

        } else {

           
            await fetchAPI('/users', {

                method: 'POST',

                body: JSON.stringify({
                    ...userData,
                    password: passwordValue
                })

            });

            showMessage(
                pageMessage,
                'User added successfully!',
                'success'
            );

        }

        closeModal();

        await loadUsers();

    } catch (error) {

        console.error('Save user error:', error);

        showMessage(
            formMessage,
            error.message,
            'error'
        );

    } finally {

        saveUserBtn.disabled = false;

        saveUserBtn.textContent = id
            ? 'Update User'
            : 'Save User';

    }

});

usersTableBody.addEventListener('click', function(event) {

    const button = event.target.closest('button[data-action]');

    if (!button) return;

    const action = button.dataset.action;

    const id = button.dataset.id;

    if (action === 'edit') {

        openEditModal(id);

    }

    if (action === 'delete') {

        deleteUser(id);

    }

});


async function deleteUser(id) {

    const user = users.find(item =>
        String(item.user_id) === String(id)
    );

    if (!user) return;

    const confirmed = confirm(
        `Are you sure you want to delete the account of ${user.username}?`
    );

    if (!confirmed) return;

    try {

        await fetchAPI(`/users/${encodeURIComponent(id)}`, {

            method: 'DELETE'

        });

        showMessage(
            pageMessage,
            'User deleted successfully!',
            'success'
        );

        await loadUsers();

    } catch (error) {

        console.error('Delete user error:', error);

        showMessage(
            pageMessage,
            'Could not delete user: ' + error.message,
            'error'
        );

    }

}

refreshUsersBtn.addEventListener('click', async function() {

    await loadUsers();

});

printUsersBtn.addEventListener('click', function() {

    if (users.length === 0) {

        alert('There are no user records to print.');

        return;

    }

    window.print();

});

backDashboardBtn.addEventListener('click', function() {

    window.location.href = 'admin-dashboard.html';

});

addUserBtn.addEventListener('click', openAddModal);

cancelUserBtn.addEventListener('click', closeModal);

userModal.addEventListener('click', function(event) {

    if (event.target === userModal) {

        closeModal();

    }

});

document.addEventListener('DOMContentLoaded', async function() {

    console.log('SCHOLA User Management started.');

    await loadUsers();

});
