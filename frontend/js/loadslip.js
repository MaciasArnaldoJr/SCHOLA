
const API_URL = 'http://localhost:3000/api';

const $ = id => document.getElementById(id);

let loadslips = [];

const lookups = {
    students: [],
    subjects: [],
    teachers: [],
    semesters: [],
    yearlevels: [],
    courses: []
};

const configs = [
    {
        key: 'students',
        url: '/students',
        id: ['student_id', 'id'],
        name: ['student_name', 'full_name', 'name']
    },
    {
        key: 'subjects',
        url: '/subjects',
        id: ['subject_id', 'id'],
        name: ['subject_code', 'subject_name', 'name']
    },
    {
        key: 'teachers',
        url: '/teachers',
        id: ['teacher_id', 'id'],
        name: ['teacher_name', 'full_name', 'name']
    },
    {
        key: 'semesters',
        url: '/semesters',
        id: ['semester_id', 'id'],
        name: ['semester_name', 'semester', 'name']
    },
    {
        key: 'yearlevels',
        url: '/yearlevels',
        id: ['year_level_id', 'yearlevel_id', 'id'],
        name: ['year_level_name', 'year_level', 'yearlevel_name', 'name']
    },
    {
        key: 'courses',
        url: '/courses',
        id: ['course_id', 'id'],
        name: ['course_code', 'course_name', 'name']
    }
];

// API CONNECTION

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
    if (Array.isArray(result)) return result;

    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.records)) return result.records;
    if (Array.isArray(result?.results)) return result.results;
    if (Array.isArray(result?.[key])) return result[key];

    return [];
}

function first(obj, keys) {
    for (const key of keys) {
        if (
            obj &&
            obj[key] !== undefined &&
            obj[key] !== null &&
            obj[key] !== ''
        ) {
            return obj[key];
        }
    }

    return '';
}

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[character]);
}

function normalizeValue(value) {
    return String(value ?? '').trim().toLowerCase();
}

function showMessage(element, message, type = 'success') {
    if (!element) return;

    element.textContent = message;
    element.className = `loadslip-message ${type}`;
}

function clearMessage(element) {
    if (!element) return;

    element.textContent = '';
    element.className = 'loadslip-message';
}

// DROPDOWN DATA

function itemId(item, config) {
    return first(item, config.id);
}

function itemName(item, config) {
    if (
        config.key === 'subjects' &&
        item.subject_code &&
        item.subject_name
    ) {
        return `${item.subject_code} - ${item.subject_name}`;
    }

    if (
        config.key === 'courses' &&
        item.course_code &&
        item.course_name
    ) {
        return `${item.course_code} - ${item.course_name}`;
    }

    return String(
        first(item, config.name) ||
        itemId(item, config) ||
        'Unnamed'
    );
}

function selectId(key) {
    return {
        students: 'studentId',
        subjects: 'subjectId',
        teachers: 'teacherId',
        semesters: 'semesterId',
        yearlevels: 'yearLevelId',
        courses: 'courseId'
    }[key];
}

async function loadLookups() {
    await Promise.all(configs.map(async config => {
        try {
            const result = await fetchAPI(config.url);

            lookups[config.key] = getArray(result, config.key);

            const select = $(selectId(config.key));

            if (!select) return;

            const placeholder =
                select.options[0]?.textContent || 'Select';

            select.innerHTML = `
                <option value="">${escapeHTML(placeholder)}</option>
            `;

            lookups[config.key].forEach(item => {
                const id = itemId(item, config);

                if (id === '') return;

                const option = document.createElement('option');

                option.value = id;
                option.textContent = itemName(item, config);

                select.appendChild(option);
            });

        } catch (error) {
            console.error(
                `Unable to load ${config.key}:`,
                error.message
            );

            lookups[config.key] = [];
        }
    }));
}

function displayName(row, key, directFields, idField) {
    const directValue = first(row, directFields);

    if (directValue) return String(directValue);

    const config = configs.find(item => item.key === key);
    const id = row[idField];

    const match = lookups[key].find(item =>
        String(itemId(item, config)) === String(id)
    );

    return match
        ? itemName(match, config)
        : (id ?? 'N/A');
}

// DATE AND STATUS

function formatDate(value) {
    if (!value) return 'N/A';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value).split('T')[0];
    }

    return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getStatusClass(status) {
    const value = normalizeValue(status);

    if (value === 'enrolled') return 'status-enrolled';
    if (value === 'pending') return 'status-pending';
    if (value === 'dropped') return 'status-dropped';

    return '';
}

// FORMAT RECORD

function view(row) {
    return {
        id: first(row, ['loadslip_id', 'id']),

        student: displayName(
            row,
            'students',
            ['student_name', 'full_name'],
            'student_id'
        ),

        subject: displayName(
            row,
            'subjects',
            ['subject_name', 'subject_title', 'subject_code'],
            'subject_id'
        ),

        teacher: displayName(
            row,
            'teachers',
            ['teacher_name', 'full_name'],
            'teacher_id'
        ),

        semester: displayName(
            row,
            'semesters',
            ['semester_name', 'semester'],
            'semester_id'
        ),

        year: displayName(
            row,
            'yearlevels',
            ['year_level_name', 'yearlevel_name', 'year_level'],
            'year_level_id'
        ),

        course: displayName(
            row,
            'courses',
            ['course_name', 'course_code'],
            'course_id'
        ),

        school: first(row, ['school_year']) || 'N/A',
        section: row.section || 'N/A',

        status: first(row, [
            'enrollment_status',
            'status'
        ]) || 'N/A',

        date: formatDate(
            first(row, ['date_enrolled', 'created_at'])
        )
    };
}

// STATISTICS

function updateStatistics(data) {
    $('totalLoadslips').textContent = data.length;

    $('enrolledCount').textContent = data.filter(row =>
        normalizeValue(first(row, [
            'enrollment_status',
            'status'
        ])) === 'enrolled'
    ).length;

    $('pendingCount').textContent = data.filter(row =>
        normalizeValue(first(row, [
            'enrollment_status',
            'status'
        ])) === 'pending'
    ).length;

    $('droppedCount').textContent = data.filter(row =>
        normalizeValue(first(row, [
            'enrollment_status',
            'status'
        ])) === 'dropped'
    ).length;
}

// LOAD RECORDS

async function loadLoadslips() {
    $('loadslipTableBody').innerHTML = `
        <tr>
            <td colspan="12" style="text-align:center;padding:30px;">
                Loading loadslip records...
            </td>
        </tr>
    `;

    clearMessage($('loadslipMessage'));

    try {
        const result = await fetchAPI('/loadslips');

        loadslips = getArray(result, 'loadslips');

        updateStatistics(loadslips);
        renderLoadslips(loadslips);

        showMessage(
            $('loadslipMessage'),
            `${loadslips.length} loadslip record(s) loaded.`,
            'success'
        );

        console.log('Loadslips retrieved from database:', loadslips);

    } catch (error) {
        console.error('Loadslip loading error:', error);

        loadslips = [];

        updateStatistics([]);

        $('loadslipTableBody').innerHTML = `
            <tr>
                <td colspan="12" style="text-align:center;padding:30px;">
                    Unable to retrieve loadslip records.
                </td>
            </tr>
        `;

        showMessage(
            $('loadslipMessage'),
            'Loadslip loading failed: ' + error.message,
            'error'
        );
    }
}

// DISPLAY RECORDS

function renderLoadslips(data) {
    if (!data.length) {
        $('loadslipTableBody').innerHTML = `
            <tr>
                <td colspan="12" style="text-align:center;padding:30px;">
                    No loadslip records found.
                </td>
            </tr>
        `;

        return;
    }

    $('loadslipTableBody').innerHTML = data.map(row => {
        const value = view(row);

        return `
            <tr>
                <td>${escapeHTML(value.id)}</td>
                <td>${escapeHTML(value.student)}</td>
                <td>${escapeHTML(value.subject)}</td>
                <td>${escapeHTML(value.teacher)}</td>
                <td>${escapeHTML(value.semester)}</td>
                <td>${escapeHTML(value.year)}</td>
                <td>${escapeHTML(value.course)}</td>
                <td>${escapeHTML(value.school)}</td>
                <td>${escapeHTML(value.section)}</td>

                <td>
                    <span class="loadslip-badge ${getStatusClass(value.status)}">
                        ${escapeHTML(value.status)}
                    </span>
                </td>

                <td>${escapeHTML(value.date)}</td>

                <td class="no-print">
                    <button
                        type="button"
                        class="loadslip-action edit-loadslip"
                        data-action="edit"
                        data-id="${escapeHTML(value.id)}">
                        Edit
                    </button>

                    <button
                        type="button"
                        class="loadslip-action delete-loadslip"
                        data-action="delete"
                        data-id="${escapeHTML(value.id)}">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// SEARCH

$('searchLoadslips').addEventListener('input', function() {
    const searchValue = normalizeValue(this.value);

    const filtered = loadslips.filter(row => {
        return Object.values(view(row)).some(value =>
            normalizeValue(value).includes(searchValue)
        );
    });

    renderLoadslips(filtered);
});

// MODAL

function openAddModal() {
    $('loadslipForm').reset();

    $('loadslipId').value = '';

    $('modalTitle').textContent = 'Add Loadslip';

    $('saveLoadslipBtn').textContent = 'Save Loadslip';

    $('enrollmentStatus').value = 'Enrolled';

    $('dateEnrolled').value =
        new Date().toISOString().slice(0, 10);

    clearMessage($('formMessage'));

    $('loadslipModal').classList.add('open');
    $('loadslipModal').setAttribute('aria-hidden', 'false');
}

function openEditModal(id) {
    const record = loadslips.find(item =>
        String(item.loadslip_id) === String(id)
    );

    if (!record) {
        showMessage(
            $('loadslipMessage'),
            'Loadslip record not found.',
            'error'
        );

        return;
    }

    $('loadslipForm').reset();

    $('loadslipId').value = record.loadslip_id;

    $('studentId').value = record.student_id ?? '';
    $('subjectId').value = record.subject_id ?? '';
    $('teacherId').value = record.teacher_id ?? '';
    $('semesterId').value = record.semester_id ?? '';
    $('yearLevelId').value = record.year_level_id ?? '';
    $('courseId').value = record.course_id ?? '';

    $('schoolYear').value = record.school_year ?? '';
    $('section').value = record.section ?? '';

    $('enrollmentStatus').value =
        record.enrollment_status ?? 'Enrolled';

    $('dateEnrolled').value =
        record.date_enrolled
            ? String(record.date_enrolled).slice(0, 10)
            : '';

    $('modalTitle').textContent = 'Edit Loadslip';

    $('saveLoadslipBtn').textContent = 'Update Loadslip';

    clearMessage($('formMessage'));

    $('loadslipModal').classList.add('open');
    $('loadslipModal').setAttribute('aria-hidden', 'false');
}

function closeModal() {
    $('loadslipModal').classList.remove('open');
    $('loadslipModal').setAttribute('aria-hidden', 'true');

    $('loadslipForm').reset();

    clearMessage($('formMessage'));
}

// SAVE RECORD

$('loadslipForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = $('loadslipId').value;

    const payload = {
        student_id: Number($('studentId').value),
        subject_id: Number($('subjectId').value),
        teacher_id: Number($('teacherId').value),
        semester_id: Number($('semesterId').value),
        year_level_id: Number($('yearLevelId').value),
        course_id: Number($('courseId').value),
        school_year: $('schoolYear').value.trim(),
        section: $('section').value.trim(),
        enrollment_status: $('enrollmentStatus').value,
        date_enrolled: $('dateEnrolled').value
    };

    if (
        !payload.student_id ||
        !payload.subject_id ||
        !payload.teacher_id ||
        !payload.semester_id ||
        !payload.year_level_id ||
        !payload.course_id ||
        !payload.school_year ||
        !payload.section ||
        !payload.date_enrolled
    ) {
        showMessage(
            $('formMessage'),
            'Please complete all required fields.',
            'error'
        );

        return;
    }

    const saveButton = $('saveLoadslipBtn');

    saveButton.disabled = true;
    saveButton.textContent = id ? 'Updating...' : 'Saving...';

    try {
        if (id) {
            await fetchAPI(`/loadslips/${encodeURIComponent(id)}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            showMessage(
                $('loadslipMessage'),
                'Loadslip updated successfully!',
                'success'
            );

        } else {
            await fetchAPI('/loadslips', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            showMessage(
                $('loadslipMessage'),
                'Loadslip added successfully!',
                'success'
            );
        }

        closeModal();

        await loadLoadslips();

    } catch (error) {
        console.error('Save loadslip error:', error);

        showMessage(
            $('formMessage'),
            error.message,
            'error'
        );

    } finally {
        saveButton.disabled = false;
        saveButton.textContent = id
            ? 'Update Loadslip'
            : 'Save Loadslip';
    }
});

// DELETE RECORD

async function deleteLoadslip(id) {
    const record = loadslips.find(item =>
        String(item.loadslip_id) === String(id)
    );

    if (!record) return;

    const confirmed = confirm(
        `Are you sure you want to delete loadslip ${id}?`
    );

    if (!confirmed) return;

    try {
        await fetchAPI(`/loadslips/${encodeURIComponent(id)}`, {
            method: 'DELETE'
        });

        showMessage(
            $('loadslipMessage'),
            'Loadslip deleted successfully!',
            'success'
        );

        await loadLoadslips();

    } catch (error) {
        console.error('Delete loadslip error:', error);

        showMessage(
            $('loadslipMessage'),
            'Could not delete loadslip: ' + error.message,
            'error'
        );
    }
}

// TABLE ACTIONS

$('loadslipTableBody').addEventListener('click', function(event) {
    const button = event.target.closest('button[data-action]');

    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === 'edit') {
        openEditModal(id);
    }

    if (action === 'delete') {
        deleteLoadslip(id);
    }
});

// BUTTONS

$('addLoadslipBtn').addEventListener('click', openAddModal);

$('cancelLoadslipBtn').addEventListener('click', closeModal);

$('closeLoadslipBtn').addEventListener('click', closeModal);

$('refreshLoadslipsBtn').addEventListener('click', async function() {
    await loadLookups();
    await loadLoadslips();
});

$('backDashboardBtn')?.addEventListener('click', function() {
    window.location.href = 'admin-dashboard.html';
});

$('printLoadslipsBtn')?.addEventListener('click', function() {
    if (loadslips.length === 0) {
        alert('There are no loadslip records to print.');
        return;
    }

    window.print();
});

$('loadslipModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeModal();
    }
});

// INITIALIZE

document.addEventListener('DOMContentLoaded', async function() {
    console.log('SCHOLA Loadslip Management started.');

    await loadLookups();
    await loadLoadslips();
});
