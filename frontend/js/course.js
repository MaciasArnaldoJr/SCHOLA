const API_URL = 'http://localhost:3000/api';

const courseTable = document.getElementById('courseTable');
const courseSearch = document.getElementById('courseSearch');
const courseCount = document.getElementById('courseCount');

const pageMessage = document.getElementById('pageMessage');

const courseOverlay = document.getElementById('courseOverlay');
const modalTitle = document.getElementById('modalTitle');

const courseForm = document.getElementById('courseForm');
const formMessage = document.getElementById('formMessage');

const courseId = document.getElementById('courseId');
const departmentId = document.getElementById('departmentId');
const courseCode = document.getElementById('courseCode');
const courseName = document.getElementById('courseName');
const description = document.getElementById('description');

const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');

const refreshCoursesBtn = document.getElementById('refreshCoursesBtn');
const backDashboardBtn = document.getElementById('backDashboardBtn');
const printCoursesBtn = document.getElementById('printCoursesBtn');


let courses = [];
let departments = [];


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

function showMessage(element, message, type = 'success') {

    element.textContent = message;
    element.className = `course-message ${type}`;

}

function clearMessage(element) {

    element.textContent = '';
    element.className = 'course-message';

}

async function loadDepartments() {

    try {

        const result = await fetchAPI('/departments');

        departments = getArray(result, 'departments');

        departmentId.innerHTML =
            '<option value="">Select Department</option>';

        departments.forEach(department => {

            const option = document.createElement('option');

            option.value = department.department_id;

            option.textContent =
                `${department.department_code} - ${department.department_name}`;

            departmentId.appendChild(option);

        });

    } catch (error) {

        console.error('Department API error:', error);

        showMessage(
            pageMessage,
            'Could not load departments: ' + error.message,
            'error'
        );

    }

}

function getDepartmentName(id) {

    const department = departments.find(item =>
        String(item.department_id) === String(id)
    );

    return department
        ? department.department_name
        : 'Unknown Department';

}

async function loadCourses() {

    courseTable.innerHTML = `
        <tr>
            <td colspan="6">Loading course records...</td>
        </tr>
    `;

    clearMessage(pageMessage);

    try {

      
        const result = await fetchAPI('/courses');

       
        courses = getArray(result, 'courses');

    
        renderCourses(courses);

        console.log('Courses retrieved from backend:', courses);

    } catch (error) {

        console.error('Course API error:', error);

        courses = [];

        courseCount.textContent = '0';

        courseTable.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to retrieve course records from the backend.
                </td>
            </tr>
        `;

        showMessage(
            pageMessage,
            'Course loading failed: ' + error.message,
            'error'
        );

    }

}

function renderCourses(data) {

    courseCount.textContent = data.length;

    if (data.length === 0) {

        courseTable.innerHTML = `
            <tr>
                <td colspan="6">No course records found.</td>
            </tr>
        `;

        return;
    }

    courseTable.innerHTML = data.map(course => `

        <tr>

            <td>${escapeHTML(course.course_id)}</td>

            <td>${escapeHTML(course.course_code)}</td>

            <td>${escapeHTML(course.course_name)}</td>

            <td>${escapeHTML(getDepartmentName(course.department_id))}</td>

            <td>${escapeHTML(course.description || 'N/A')}</td>

            <td class="no-print">

                <button
                    type="button"
                    class="edit-btn"
                    data-action="edit"
                    data-id="${escapeHTML(course.course_id)}">
                    Edit
                </button>

                <button
                    type="button"
                    class="delete-btn"
                    data-action="delete"
                    data-id="${escapeHTML(course.course_id)}">
                    Delete
                </button>

            </td>

        </tr>

    `).join('');

}

courseSearch.addEventListener('input', function() {

    const searchValue = this.value.toLowerCase().trim();

    const filteredCourses = courses.filter(course => {

        return (
            String(course.course_id ?? '').toLowerCase().includes(searchValue) ||
            String(course.course_code ?? '').toLowerCase().includes(searchValue) ||
            String(course.course_name ?? '').toLowerCase().includes(searchValue) ||
            String(course.description ?? '').toLowerCase().includes(searchValue) ||
            getDepartmentName(course.department_id).toLowerCase().includes(searchValue)
        );

    });

    renderCourses(filteredCourses);

});

function openAddModal() {

    courseForm.reset();

    courseId.value = '';

    modalTitle.textContent = 'Add Course';

    saveBtn.textContent = 'Save Course';

    clearMessage(formMessage);

    courseOverlay.classList.add('show');

}

function openEditModal(id) {

    const course = courses.find(item =>
        String(item.course_id) === String(id)
    );

    if (!course) {
        showMessage(pageMessage, 'Course not found.', 'error');
        return;
    }

    courseForm.reset();

    courseId.value = course.course_id;
    departmentId.value = course.department_id ?? '';
    courseCode.value = course.course_code ?? '';
    courseName.value = course.course_name ?? '';
    description.value = course.description ?? '';

    modalTitle.textContent = 'Edit Course';

    saveBtn.textContent = 'Update Course';

    clearMessage(formMessage);

    courseOverlay.classList.add('show');

}

function closeModal() {

    courseOverlay.classList.remove('show');

    courseForm.reset();

    clearMessage(formMessage);

}

courseForm.addEventListener('submit', async function(event) {

    event.preventDefault();

    const id = courseId.value;

    const courseData = {

        department_id: departmentId.value,

        course_code: courseCode.value.trim(),

        course_name: courseName.value.trim(),

        description: description.value.trim()

    };

    if (
        !courseData.department_id ||
        !courseData.course_code ||
        !courseData.course_name
    ) {

        showMessage(
            formMessage,
            'Please complete all required fields.',
            'error'
        );

        return;
    }

    saveBtn.disabled = true;

    saveBtn.textContent = id ? 'Updating...' : 'Saving...';

    try {

        if (id) {

            await fetchAPI(`/courses/${encodeURIComponent(id)}`, {

                method: 'PUT',

                body: JSON.stringify(courseData)

            });

            showMessage(
                pageMessage,
                'Course updated successfully!',
                'success'
            );

        } else {

            await fetchAPI('/courses', {

                method: 'POST',

                body: JSON.stringify(courseData)

            });

            showMessage(
                pageMessage,
                'Course added successfully!',
                'success'
            );

        }

        closeModal();

        await loadCourses();

    } catch (error) {

        console.error('Save course error:', error);

        showMessage(
            formMessage,
            error.message,
            'error'
        );

    } finally {

        saveBtn.disabled = false;

        saveBtn.textContent = id ? 'Update Course' : 'Save Course';

    }

});


courseTable.addEventListener('click', function(event) {

    const button = event.target.closest('button[data-action]');

    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === 'edit') {

        openEditModal(id);

    }

    if (action === 'delete') {

        deleteCourse(id);

    }

});


async function deleteCourse(id) {

    const course = courses.find(item =>
        String(item.course_id) === String(id)
    );

    if (!course) return;

    const confirmed = confirm(
        `Are you sure you want to delete ${course.course_name}?`
    );

    if (!confirmed) return;

    try {

        await fetchAPI(`/courses/${encodeURIComponent(id)}`, {

            method: 'DELETE'

        });

        showMessage(
            pageMessage,
            'Course deleted successfully!',
            'success'
        );

        await loadCourses();

    } catch (error) {

        console.error('Delete course error:', error);

        showMessage(
            pageMessage,
            error.message,
            'error'
        );

    }

}


printCoursesBtn.addEventListener('click', function() {

    if (courses.length === 0) {

        alert('There are no course records to print.');

        return;

    }

    window.print();

});


addBtn.addEventListener('click', openAddModal);

cancelBtn.addEventListener('click', closeModal);

refreshCoursesBtn.addEventListener('click', async function() {

    await loadDepartments();

    await loadCourses();

});

backDashboardBtn.addEventListener('click', function() {

    window.location.href = 'admin-dashboard.html';

});


courseOverlay.addEventListener('click', function(event) {

    if (event.target === courseOverlay) {

        closeModal();

    }

});

document.addEventListener('DOMContentLoaded', async function() {

    console.log('SCHOLA Course Management started.');

    await loadDepartments();

    await loadCourses();

});