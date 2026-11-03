
// ============================================
// SCHOLA - ADMIN DASHBOARD
// ============================================

// Backend API URL
const API_URL = 'http://localhost:3000/api';

// ============================================
// PAGE ELEMENTS
// ============================================

const pageContent = document.getElementById('pageContent');
const pageTitle = document.getElementById('pageTitle');

const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');

const sidebarLinks = document.querySelectorAll('.sidebar-link');

const totalCourses = document.getElementById('totalCourses');
const totalDepartments = document.getElementById('totalDepartments');
const totalUsers = document.getElementById('totalUsers');
const totalEnrollments = document.getElementById('totalEnrollments');

const recentActivity = document.getElementById('recentActivity');

// ============================================
// MODULE PAGE LOCATIONS
// All HTML files are inside the pages folder.
// ============================================

const modulePages = {
    courses: 'course.html',
    departments: 'department.html',
    enrollment: 'enrollment.html',
    evaluation: 'evaluation.html',
    grades: 'grade.html',
    loadslip: 'loadslip.html',
    reports: 'reports.html',
    users: 'user.html'
};

// ============================================
// API HELPER
// ============================================

async function fetchAPI(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
}

// Handles different API response formats
function getArray(result, key) {
    if (Array.isArray(result)) {
        return result;
    }

    if (result && Array.isArray(result.data)) {
        return result.data;
    }

    if (result && key && Array.isArray(result[key])) {
        return result[key];
    }

    return [];
}

// ============================================
// DASHBOARD STATISTICS
// ============================================

async function loadDashboardStats() {

    // Display loading values
    totalCourses.textContent = '...';
    totalDepartments.textContent = '...';
    totalUsers.textContent = '...';
    totalEnrollments.textContent = '...';

    try {

        const [
            coursesResult,
            departmentsResult,
            usersResult,
            enrollmentsResult
        ] = await Promise.all([
            fetchAPI('/courses'),
            fetchAPI('/departments'),
            fetchAPI('/users'),
            fetchAPI('/loadslips')
        ]);

        const courses = getArray(coursesResult, 'courses');
        const departments = getArray(departmentsResult, 'departments');
        const users = getArray(usersResult, 'users');
        const enrollments = getArray(enrollmentsResult, 'loadslips');

        totalCourses.textContent = courses.length;
        totalDepartments.textContent = departments.length;
        totalUsers.textContent = users.length;
        totalEnrollments.textContent = enrollments.length;

    } catch (error) {

        console.error('Dashboard statistics error:', error);

        totalCourses.textContent = '—';
        totalDepartments.textContent = '—';
        totalUsers.textContent = '—';
        totalEnrollments.textContent = '—';

        showDashboardMessage(
            'Unable to load dashboard statistics. Please check your backend server and API routes.'
        );
    }
}

// ============================================
// DASHBOARD MESSAGE
// ============================================

function showDashboardMessage(message) {

    let messageElement = document.getElementById('dashboardMessage');

    if (!messageElement) {
        messageElement = document.createElement('p');
        messageElement.id = 'dashboardMessage';
        messageElement.className = 'dashboard-message';

        const welcome = document.querySelector('.dashboard-welcome');

        if (welcome) {
            welcome.after(messageElement);
        } else {
            pageContent.prepend(messageElement);
        }
    }

    messageElement.textContent = message;
}

// ============================================
// SIDEBAR NAVIGATION
// ============================================

function navigateTo(view) {

    // Dashboard
    if (view === 'dashboard') {

        window.location.href = 'admin-dashboard.html';
        return;
    }

    // Other module pages
    const page = modulePages[view];

    if (page) {
        window.location.href = page;
        return;
    }

    console.warn('Page not found:', view);
}

// ============================================
// SIDEBAR CLICK EVENTS
// ============================================

sidebarLinks.forEach(link => {

    link.addEventListener('click', function(event) {

        event.preventDefault();

        const view = this.dataset.view;

        if (view) {
            navigateTo(view);
        }

    });

});

// ============================================
// QUICK ACCESS CARD EVENTS
// ============================================

if (pageContent) {

    pageContent.addEventListener('click', function(event) {

        const moduleCard = event.target.closest('.module-card');

        if (moduleCard) {

            const view = moduleCard.dataset.view;

            if (view) {
                navigateTo(view);
            }

        }

    });

}

// ============================================
// MOBILE SIDEBAR TOGGLE
// ============================================

if (menuToggle && sidebar) {

    menuToggle.addEventListener('click', function() {

        sidebar.classList.toggle('mobile-open');

    });

}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {

    if (!sidebar || !menuToggle) {
        return;
    }

    const clickedInsideSidebar = sidebar.contains(event.target);
    const clickedMenuButton = menuToggle.contains(event.target);

    if (
        !clickedInsideSidebar &&
        !clickedMenuButton &&
        window.innerWidth <= 768
    ) {
        sidebar.classList.remove('mobile-open');
    }

});

// ============================================
// DASHBOARD REFRESH
// ============================================

async function refreshDashboard() {
    await loadDashboardStats();
}

// ============================================
// INITIALIZE DASHBOARD
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    console.log('SCHOLA Admin Dashboard initialized.');

    loadDashboardStats();

});

// ============================================
// MAKE REFRESH FUNCTION AVAILABLE
// ============================================

window.refreshDashboard = refreshDashboard;
