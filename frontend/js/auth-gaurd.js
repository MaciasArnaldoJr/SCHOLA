
(() => {

    const loginPage = './login.html';

    const rawAdmin = localStorage.getItem('scholaAdmin');

    if (!rawAdmin) {
        window.location.replace(loginPage);
        return;
    }

    let admin;

    try {
        admin = JSON.parse(rawAdmin);
    } catch (error) {
        localStorage.removeItem('scholaAdmin');
        window.location.replace(loginPage);
        return;
    }

    if (!admin || admin.role !== 'Admin') {
        localStorage.removeItem('scholaAdmin');
        window.location.replace(loginPage);
        return;
    }

    const name = document.getElementById('topbarAdminName');
    const avatar = document.getElementById('adminAvatar');

    if (name) {
        name.textContent = admin.username || 'Administrator';
    }

    if (avatar) {
        avatar.textContent = (admin.username || 'A')
            .charAt(0).toUpperCase();
    }

})();
