const API_BASE = 'http://localhost:3000/api';

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

function rows(data) {
    if (Array.isArray(data)) return data;

    for (const key of ['data', 'records', 'results', 'loadslips']) {
        if (Array.isArray(data?.[key])) {
            return data[key];
        }
    }

    return [];
}

async function api(url, options = {}) {

    const response = await fetch(API_BASE + url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });

    const text = await response.text();

    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            data ||
            `HTTP ${response.status}`
        );
    }

    return data;
}

function esc(value) {

    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);

}

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
        students: 'student_id',
        subjects: 'subject_id',
        teachers: 'teacher_id',
        semesters: 'semester_id',
        yearlevels: 'year_level_id',
        courses: 'course_id'
    }[key];

}

async function loadLookups() {

    await Promise.all(configs.map(async config => {

        try {

            lookups[config.key] = rows(
                await api(config.url)
            );

            const select = $(selectId(config.key));

            const old = select.options[0]?.textContent || 'Select';

            select.innerHTML = `
                <option value="">${esc(old)}</option>
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

            console.warn(
                `Lookup ${config.key} unavailable:`,
                error.message
            );

            lookups[config.key] = [];

        }

    }));

}

function displayName(row, key, directFields, idField) {

    const directValue = first(row, directFields);

    if (directValue) {
        return String(directValue);
    }

    const config = configs.find(item => item.key === key);

    const id = row[idField];

    const match = lookups[key].find(item =>
        String(itemId(item, config)) === String(id)
    );

    return match
        ? itemName(match, config)
        : (id ?? '—');

}

function dateText(value) {

    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value).split('T')[0];
    }

    return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });

}

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
            ['teacher_name'],
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

        school: first(row, ['school_year']) || '—',

        section: row.section || '—',

        status: first(row, [
            'enrollment_status',
            'status'
        ]) || '—',

        date: dateText(
            first(row, ['date_enrolled', 'created_at'])
        )

    };

}

function render() {

    const query = $('searchInput').value
        .trim()
        .toLowerCase();

    const filtered = loadslips.filter(row => {

        return Object.values(view(row)).some(value =>
            String(value).toLowerCase().includes(query)
        );

    });

    if (!filtered.length) {

        $('loadslipTableBody').innerHTML = `
            <tr>
                <td colspan="12" class="ls-empty">
                    ${
                        loadslips.length
                            ? 'No matching records.'
                            : 'No loadslip records found.'
                    }
                </td>
            </tr>
        `;

        return;

    }

    $('loadslipTableBody').innerHTML = filtered.map(row => {

        const value = view(row);

        const statusClass = String(value.status)
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '');

        return `
            <tr>

                <td>${esc(value.id)}</td>
                <td>${esc(value.student)}</td>
                <td>${esc(value.subject)}</td>
                <td>${esc(value.teacher)}</td>
                <td>${esc(value.semester)}</td>
                <td>${esc(value.year)}</td>
                <td>${esc(value.course)}</td>
                <td>${esc(value.school)}</td>
                <td>${esc(value.section)}</td>

                <td>
                    <span class="ls-status ${statusClass}">
                        ${esc(value.status)}
                    </span>
                </td>

                <td>${esc(value.date)}</td>

                <td class="ls-row-actions">

                    <button
                        class="ls-small ls-edit"
                        data-action="edit"
                        data-id="${esc(value.id)}"
                    >
                        Edit
                    </button>

                    <button
                        class="ls-small ls-delete"
                        data-action="delete"
                        data-id="${esc(value.id)}"
                    >
                        Delete
                    </button>

                </td>

            </tr>
        `;

    }).join('');

}

function stats() {

    $('totalLoadslips').textContent = loadslips.length;

    $('enrolledCount').textContent = loadslips.filter(row =>
        String(first(row, [
            'enrollment_status',
            'status'
        ])).toLowerCase() === 'enrolled'
    ).length;

    $('pendingCount').textContent = loadslips.filter(row =>
        String(first(row, [
            'enrollment_status',
            'status'
        ])).toLowerCase() === 'pending'
    ).length;

}

async function loadLoadslips() {

    $('pageMessage').textContent =
        'Loading loadslip records...';

    try {

        loadslips = rows(
            await api('/loadslips')
        );

        stats();
        render();

        $('pageMessage').textContent =
            `${loadslips.length} loadslip record(s) loaded.`;

    } catch (error) {

        $('loadslipTableBody').innerHTML = `
            <tr>
                <td colspan="12" class="ls-empty">
                    Unable to load records: ${esc(error.message)}
                </td>
            </tr>
        `;

        $('pageMessage').textContent =
            'Check that the backend is running and /api/loadslips is available.';

    }

}

function openModal(record) {

    $('loadslipForm').reset();

    $('formMessage').textContent = '';

    $('loadslipId').value = record
        ? first(record, ['loadslip_id', 'id'])
        : '';

    $('modalTitle').textContent = record
        ? 'Edit Loadslip'
        : 'Add Loadslip';

    if (record) {

        [
            'student_id',
            'subject_id',
            'teacher_id',
            'semester_id',
            'year_level_id',
            'course_id',
            'school_year',
            'section',
            'enrollment_status',
            'date_enrolled'
        ].forEach(id => {

            if ($(id)) {
                $(id).value = record[id] ?? '';
            }

        });

        if ($('date_enrolled').value) {

            $('date_enrolled').value =
                String($('date_enrolled').value).slice(0, 10);

        }

    } else {

        $('enrollment_status').value = 'Enrolled';

        $('date_enrolled').value =
            new Date().toISOString().slice(0, 10);

    }

    $('modalOverlay').classList.add('open');

    $('modalOverlay').setAttribute(
        'aria-hidden',
        'false'
    );

}

function closeModal() {

    $('modalOverlay').classList.remove('open');

    $('modalOverlay').setAttribute(
        'aria-hidden',
        'true'
    );

}

async function save(event) {

    event.preventDefault();

    const id = $('loadslipId').value;

    const payload = {

        student_id: Number($('student_id').value),

        subject_id: Number($('subject_id').value),

        teacher_id: Number($('teacher_id').value),

        semester_id: Number($('semester_id').value),

        year_level_id: Number($('year_level_id').value),

        course_id: Number($('course_id').value),

        school_year: $('school_year').value.trim(),

        section: $('section').value.trim(),

        enrollment_status: $('enrollment_status').value,

        date_enrolled: $('date_enrolled').value

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

        $('formMessage').textContent =
            'Please complete all required fields.';

        return;

    }

    $('saveBtn').disabled = true;
    $('saveBtn').textContent = 'Saving...';

    try {

        await api(
            id
                ? `/loadslips/${encodeURIComponent(id)}`
                : '/loadslips',
            {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(payload)
            }
        );

        closeModal();

        await loadLoadslips();

    } catch (error) {

        $('formMessage').textContent = error.message;

    } finally {

        $('saveBtn').disabled = false;
        $('saveBtn').textContent = 'Save Loadslip';

    }

}

async function remove(id) {

    const row = loadslips.find(item =>
        String(first(item, ['loadslip_id', 'id'])) === String(id)
    );

    if (!confirm(
        `Delete loadslip ${id}${row ? ' for ' + view(row).student : ''}?`
    )) {
        return;
    }

    try {

        await api(
            `/loadslips/${encodeURIComponent(id)}`,
            { method: 'DELETE' }
        );

        await loadLoadslips();

    } catch (error) {

        $('pageMessage').textContent =
            `Delete failed: ${error.message}`;

    }

}

$('backDashboardBtn').addEventListener('click', () => {

    location.href = 'admin-dashboard.html';

});

$('refreshBtn').addEventListener('click', async () => {

    await loadLookups();
    await loadLoadslips();

});

$('printBtn').addEventListener('click', () => {

    window.print();

});

$('addBtn').addEventListener('click', () => {

    openModal(null);

});

$('cancelBtn').addEventListener('click', closeModal);

$('closeModalBtn').addEventListener('click', closeModal);

$('modalOverlay').addEventListener('click', event => {

    if (event.target === $('modalOverlay')) {
        closeModal();
    }

});

$('loadslipForm').addEventListener('submit', save);

$('searchInput').addEventListener('input', render);


$('loadslipTableBody').addEventListener('click', event => {

    const button = event.target.closest(
        'button[data-action]'
    );

    if (!button) return;

    const row = loadslips.find(item =>
        String(first(item, ['loadslip_id', 'id'])) ===
        String(button.dataset.id)
    );

    if (button.dataset.action === 'edit' && row) {

        openModal(row);

    }

    if (button.dataset.action === 'delete') {

        remove(button.dataset.id);

    }

});

(async () => {

    await loadLookups();

    await loadLoadslips();

})();