const API_URL = 'http://localhost:3000/api';

const gradeTable = document.getElementById('gradeTable');
const gradeSearch = document.getElementById('gradeSearch');

const gradeOverlay = document.getElementById('gradeOverlay');
const gradeForm = document.getElementById('gradeForm');

const pageMessage = document.getElementById('pageMessage');
const formMessage = document.getElementById('formMessage');

const studentId = document.getElementById('studentId');
const loadslipId = document.getElementById('loadslipId');

const midtermGrade = document.getElementById('midtermGrade');
const finalGrade = document.getElementById('finalGrade');

let grades = [];
let students = [];
let loadslips = [];

function convertToCollegeGPA(percentage) {

    if (percentage >= 96) return 1.00;
    if (percentage >= 94) return 1.25;
    if (percentage >= 92) return 1.50;
    if (percentage >= 89) return 1.75;
    if (percentage >= 87) return 2.00;
    if (percentage >= 84) return 2.25;
    if (percentage >= 82) return 2.50;
    if (percentage >= 79) return 2.75;
    if (percentage >= 75) return 3.00;

    return 5.00;
}

function calculateGrade(midterm, final) {

    if (
        midterm === '' ||
        final === '' ||
        midterm === null ||
        final === null
    ) {
        return null;
    }

    const mid = Number(midterm);
    const fin = Number(final);

    if (
        !Number.isFinite(mid) ||
        !Number.isFinite(fin) ||
        mid < 0 ||
        mid > 100 ||
        fin < 0 ||
        fin > 100
    ) {
        return null;
    }

    const average = (mid + fin) / 2;
    const gpa = convertToCollegeGPA(average);

    return {
        average: average,
        gpa: gpa,
        remarks: average >= 75 ? 'Passed' : 'Failed'
    };
}

function updateCalculator() {

    const result = calculateGrade(
        midtermGrade.value,
        finalGrade.value
    );

    const averageDisplay = document.getElementById('computedAverage');
    const gpaDisplay = document.getElementById('computedGPA');
    const equivalentDisplay = document.getElementById('computedEquivalent');
    const remarksDisplay = document.getElementById('computedRemarks');

    if (!result) {
        averageDisplay.textContent = '—';
        gpaDisplay.textContent = '—';
        equivalentDisplay.textContent = '—';
        remarksDisplay.textContent = '—';
        return;
    }

    averageDisplay.textContent = result.average.toFixed(2) + '%';
    gpaDisplay.textContent = result.gpa.toFixed(2);

    equivalentDisplay.textContent =
        result.gpa === 5 ? 'Failed' : 'Passed';

    remarksDisplay.textContent = result.remarks;

    remarksDisplay.style.color =
        result.remarks === 'Passed' ? '#16834b' : '#c03939';
}


// Update the calculator immediately when grades change.
midtermGrade.addEventListener('input', updateCalculator);
finalGrade.addEventListener('input', updateCalculator);

async function apiRequest(endpoint, options = {}) {

    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.error ||
            data.message ||
            `Request failed: ${response.status}`
        );
    }

    return data;
}

function getArray(data, possibleKeys = []) {

    if (Array.isArray(data)) {
        return data;
    }

    if (data && Array.isArray(data.data)) {
        return data.data;
    }

    for (const key of possibleKeys) {
        if (data && Array.isArray(data[key])) {
            return data[key];
        }
    }

    return [];
}

async function loadPageData() {

    showPageMessage('', '');

    gradeTable.innerHTML = `
        <tr>
            <td colspan="8" style="text-align:center;">
                Loading grade records...
            </td>
        </tr>
    `;

    try {

        const results = await Promise.all([
            apiRequest('/grades'),
            apiRequest('/students'),
            apiRequest('/loadslips')
        ]);

        grades = getArray(results[0], ['grades', 'results']);
        students = getArray(results[1], ['students', 'results']);
        loadslips = getArray(results[2], ['loadslips', 'results']);

        populateStudentDropdown();
        populateLoadslipDropdown();

        renderGrades(grades);
        updateStatistics();

    } catch (error) {

        console.error('Grade loading error:', error);

        gradeTable.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;color:#c03939;">
                    Unable to load grade records.
                    Please check your backend server and API routes.
                </td>
            </tr>
        `;

        showPageMessage(error.message, 'error');
    }
}

function populateStudentDropdown(selectedId = '') {

    studentId.innerHTML = `
        <option value="">Select Student</option>
    `;

    students.forEach(student => {

        const id = student.student_id;

        const name =
            student.student_name ||
            student.full_name ||
            [
                student.first_name,
                student.middle_name,
                student.last_name
            ].filter(Boolean).join(' ') ||
            `Student ${id}`;

        const option = document.createElement('option');

        option.value = id;
        option.textContent = name;

        if (String(id) === String(selectedId)) {
            option.selected = true;
        }

        studentId.appendChild(option);
    });
}

function populateLoadslipDropdown(selectedId = '') {

    loadslipId.innerHTML = `
        <option value="">Select Loadslip</option>
    `;

    loadslips.forEach(loadslip => {

        const id = loadslip.loadslip_id;

        const option = document.createElement('option');

        option.value = id;
        option.textContent = `Loadslip #${id}`;

        if (String(id) === String(selectedId)) {
            option.selected = true;
        }

        loadslipId.appendChild(option);
    });
}

function getStudentName(id) {

    const student = students.find(
        item => String(item.student_id) === String(id)
    );

    if (!student) {
        return `Student #${id ?? '—'}`;
    }

    return student.student_name ||
        student.full_name ||
        [
            student.first_name,
            student.middle_name,
            student.last_name
        ].filter(Boolean).join(' ') ||
        `Student #${id}`;
}

function renderGrades(data) {

    const searchTerm = gradeSearch.value.toLowerCase().trim();

    const filteredGrades = data.filter(grade => {

        const student = getStudentName(grade.student_id);

        return (
            String(grade.grade_id || '').toLowerCase().includes(searchTerm) ||
            student.toLowerCase().includes(searchTerm) ||
            String(grade.loadslip_id || '').toLowerCase().includes(searchTerm)
        );
    });

    if (filteredGrades.length === 0) {

        gradeTable.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;padding:25px;">
                    No grade records found.
                </td>
            </tr>
        `;

        return;
    }

    gradeTable.innerHTML = filteredGrades.map(grade => {

        const result = calculateGrade(
            grade.midterm_grade,
            grade.final_grade
        );

        const gpa = result ? result.gpa.toFixed(2) : '—';
        const remarks = result ? result.remarks : 'Incomplete';

        const badgeClass =
            remarks === 'Passed'
                ? 'passed'
                : remarks === 'Failed'
                    ? 'failed'
                    : 'pending';

        return `
            <tr>
                <td>GRD-${String(grade.grade_id).padStart(3, '0')}</td>

                <td>${escapeHTML(getStudentName(grade.student_id))}</td>

                <td>${escapeHTML(String(grade.loadslip_id ?? '—'))}</td>

                <td>${formatNumber(grade.midterm_grade)}</td>

                <td>${formatNumber(grade.final_grade)}</td>

                <td><strong>${gpa}</strong></td>

                <td>
                    <span class="grade-badge ${badgeClass}">
                        ${remarks}
                    </span>
                </td>

                <td>
                    <button
                        class="action-btn"
                        data-action="edit"
                        data-id="${grade.grade_id}">
                        Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        data-action="delete"
                        data-id="${grade.grade_id}">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    }).join('');
}

function formatNumber(value) {

    if (value === null || value === undefined || value === '') {
        return '—';
    }

    return Number(value).toFixed(2);
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


function updateStatistics() {

    let passed = 0;
    let failed = 0;

    grades.forEach(grade => {

        const result = calculateGrade(
            grade.midterm_grade,
            grade.final_grade
        );

        if (!result) return;

        if (result.remarks === 'Passed') {
            passed++;
        } else {
            failed++;
        }
    });

    document.getElementById('totalGrades').textContent = grades.length;
    document.getElementById('passedGrades').textContent = passed;
    document.getElementById('failedGrades').textContent = failed;
}

function openModal() {

    gradeOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {

    gradeOverlay.classList.remove('active');
    document.body.style.overflow = '';
    gradeForm.reset();

    document.getElementById('gradeId').value = '';

    document.getElementById('modalTitle').textContent = 'Add Grade';
    document.getElementById('saveBtn').textContent = 'Save Grade';

    clearFormMessage();
    updateCalculator();
}


function addGrade() {

    gradeForm.reset();

    document.getElementById('gradeId').value = '';

    document.getElementById('modalTitle').textContent = 'Add Grade';
    document.getElementById('saveBtn').textContent = 'Save Grade';

    clearFormMessage();
    updateCalculator();

    openModal();
}

function editGrade(id) {

    const grade = grades.find(
        item => String(item.grade_id) === String(id)
    );

    if (!grade) {
        showPageMessage('Grade record not found.', 'error');
        return;
    }

    document.getElementById('gradeId').value = grade.grade_id;

    populateStudentDropdown(grade.student_id);
    populateLoadslipDropdown(grade.loadslip_id);

    midtermGrade.value = grade.midterm_grade ?? '';
    finalGrade.value = grade.final_grade ?? '';

    document.getElementById('modalTitle').textContent = 'Edit Grade';
    document.getElementById('saveBtn').textContent = 'Update Grade';

    clearFormMessage();
    updateCalculator();

    openModal();
}

gradeForm.addEventListener('submit', async event => {

    event.preventDefault();

    const id = document.getElementById('gradeId').value;

    const student = studentId.value;
    const loadslip = loadslipId.value;

    const midterm = midtermGrade.value;
    const final = finalGrade.value;

    if (!student || !loadslip || midterm === '' || final === '') {
        showFormMessage('Please complete all required fields.', 'error');
        return;
    }

    const result = calculateGrade(midterm, final);

    if (!result) {
        showFormMessage(
            'Grades must be valid numbers between 0 and 100.',
            'error'
        );
        return;
    }

    const payload = {
        student_id: Number(student),
        loadslip_id: Number(loadslip),

        prelim_grade: null,

        midterm_grade: Number(midterm),
        final_grade: Number(final),

        overall_grade: Number(result.average.toFixed(2)),
        remarks: result.remarks
    };

    const saveButton = document.getElementById('saveBtn');

    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    try {

        if (id) {

            await apiRequest(`/grades/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            showPageMessage('Grade updated successfully.', 'success');

        } else {

            await apiRequest('/grades', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            showPageMessage('Grade added successfully.', 'success');
        }

        closeModal();
        await loadPageData();

    } catch (error) {

        console.error('Grade save error:', error);

        showFormMessage(error.message, 'error');

    } finally {

        saveButton.disabled = false;

        saveButton.textContent = id
            ? 'Update Grade'
            : 'Save Grade';
    }
});

async function deleteGrade(id) {

    const confirmed = confirm(
        'Are you sure you want to delete this grade record?'
    );

    if (!confirmed) return;

    try {

        await apiRequest(`/grades/${id}`, {
            method: 'DELETE'
        });

        showPageMessage('Grade deleted successfully.', 'success');

        await loadPageData();

    } catch (error) {

        console.error('Grade delete error:', error);

        showPageMessage(error.message, 'error');
    }
}

gradeTable.addEventListener('click', event => {

    const button = event.target.closest('[data-action]');

    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === 'edit') {
        editGrade(id);
    }

    if (action === 'delete') {
        deleteGrade(id);
    }
});

gradeSearch.addEventListener('input', () => {
    renderGrades(grades);
});

function showPageMessage(message, type) {

    pageMessage.textContent = message;
    pageMessage.className = 'grade-message';

    if (message) {
        pageMessage.classList.add(type);
    }
}

function showFormMessage(message, type) {

    formMessage.textContent = message;
    formMessage.className = 'grade-message';

    if (message) {
        formMessage.classList.add(type);
    }
}

function clearFormMessage() {

    formMessage.textContent = '';
    formMessage.className = 'grade-message';
}

document.getElementById('addGradeBtn').addEventListener('click', addGrade);

document.getElementById('cancelBtn').addEventListener('click', closeModal);

document.getElementById('closeModalBtn').addEventListener('click', closeModal);

document.getElementById('refreshBtn').addEventListener('click', loadPageData);

document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
});

document.getElementById('backDashboardBtn').addEventListener('click', () => {
    window.location.href = 'admin-dashboard.html';
});

gradeOverlay.addEventListener('click', event => {

    if (event.target === gradeOverlay) {
        closeModal();
    }
});

loadPageData();