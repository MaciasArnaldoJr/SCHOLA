document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:3000/api';

    let enrollments = [];
    let students = [];
    let subjects = [];
    let teachers = [];
    let semesters = [];
    let yearLevels = [];
    let courses = [];

    const enrollmentTable = document.getElementById('enrollmentTable');
    const totalEnrollments = document.getElementById('totalEnrollments');
    const enrolledCount = document.getElementById('enrolledCount');
    const pendingCount = document.getElementById('pendingCount');

    const pageMessage = document.getElementById('pageMessage');
    const formMessage = document.getElementById('formMessage');

    const searchInput = document.getElementById('search');
    const overlay = document.getElementById('overlay');
    const enrollmentForm = document.getElementById('enrollmentForm');

    const enrollmentId = document.getElementById('enrollmentId');
    const modalTitle = document.getElementById('modalTitle');

    const studentSelect = document.getElementById('student_id');
    const subjectSelect = document.getElementById('subject_id');
    const teacherSelect = document.getElementById('teacher_id');
    const semesterSelect = document.getElementById('semester_id');
    const yearLevelSelect = document.getElementById('year_level_id');
    const courseSelect = document.getElementById('course_id');

    const schoolYearInput = document.getElementById('school_year');
    const sectionInput = document.getElementById('section');
    const statusSelect = document.getElementById('enrollment_status');
    const dateInput = document.getElementById('date_enrolled');

    function escapeHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        })[character]);
    }

    function getArray(result, possibleKeys = []) {
        if (Array.isArray(result)) {
            return result;
        }

        if (result && Array.isArray(result.data)) {
            return result.data;
        }

        for (const key of possibleKeys) {
            if (result && Array.isArray(result[key])) {
                return result[key];
            }
        }

        return [];
    }

    async function apiRequest(endpoint, options = {}) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(
                result?.message ||
                result?.error ||
                `Request failed with status ${response.status}`
            );
        }

        return result;
    }

    function getFullName(person) {
        if (!person) {
            return 'Unknown';
        }

        if (person.full_name) return person.full_name;
        if (person.student_name) return person.student_name;
        if (person.teacher_name) return person.teacher_name;

        const firstName = person.fname || person.first_name || '';
        const middleName = person.mname || person.middle_name || '';
        const lastName = person.lname || person.last_name || '';

        const name = [firstName, middleName, lastName]
            .filter(Boolean)
            .join(' ');

        return name || `Record #${person.student_id || person.teacher_id || ''}`;
    }

    function findRecord(records, id, idField) {
        return records.find(record =>
            String(record[idField]) === String(id)
        );
    }

    function formatDate(value) {
        if (!value) return '—';

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value).slice(0, 10);
        }

        return date.toLocaleDateString('en-CA');
    }

    function getStatusClass(status) {
        const normalized = String(status || '').toLowerCase();

        if (normalized === 'enrolled') return 'status-enrolled';
        if (normalized === 'pending') return 'status-pending';
        if (normalized === 'dropped') return 'status-dropped';

        return '';
    }

    function showMessage(element, message, isError = false) {
        element.textContent = message;
        element.className = `message ${isError ? 'error' : 'success'}`;
    }

    function clearMessage(element) {
        element.textContent = '';
        element.className = 'message';
    }

    function getStudentName(id) {
        const student = findRecord(students, id, 'student_id');
        return student ? getFullName(student) : `Student #${id}`;
    }

    function getSubjectName(id) {
        const subject = findRecord(subjects, id, 'subject_id');

        if (!subject) return `Subject #${id}`;

        return subject.subject_code
            ? `${subject.subject_code} - ${subject.subject_name || ''}`
            : subject.subject_name || `Subject #${id}`;
    }

    function getTeacherName(id) {
        const teacher = findRecord(teachers, id, 'teacher_id');
        return teacher ? getFullName(teacher) : `Teacher #${id}`;
    }

    function getSemesterName(id) {
        const semester = findRecord(semesters, id, 'semester_id');

        if (!semester) return `Semester #${id}`;

        return [
            semester.semester_name,
            semester.academic_year
        ].filter(Boolean).join(' - ');
    }

    function getYearLevelName(id) {
        const yearLevel = findRecord(yearLevels, id, 'year_level_id');

        return yearLevel
            ? yearLevel.year_level_name || `Year Level #${id}`
            : `Year Level #${id}`;
    }

    function getCourseName(id) {
        const course = findRecord(courses, id, 'course_id');

        return course
            ? `${course.course_code || ''} ${course.course_name || ''}`.trim()
            : `Course #${id}`;
    }

    function fillSelect(selectElement, records, idField, labelFunction, placeholder) {
        selectElement.innerHTML =
            `<option value="">${escapeHTML(placeholder)}</option>`;

        records.forEach(record => {
            const option = document.createElement('option');

            option.value = record[idField];
            option.textContent = labelFunction(record);

            selectElement.appendChild(option);
        });
    }

    async function loadDropdownData() {
        const endpoints = [
            {
                url: '/students',
                key: 'students',
                keys: ['students']
            },
            {
                url: '/subjects',
                key: 'subjects',
                keys: ['subjects']
            },
            {
                url: '/teachers',
                key: 'teachers',
                keys: ['teachers']
            },
            {
                url: '/semesters',
                key: 'semesters',
                keys: ['semesters']
            },
            {
                url: '/yearlevels',
                key: 'yearLevels',
                keys: ['yearLevels', 'yearlevels']
            },
            {
                url: '/courses',
                key: 'courses',
                keys: ['courses']
            }
        ];

        const results = await Promise.all(
            endpoints.map(async endpoint => {
                try {
                    const result = await apiRequest(endpoint.url);
                    return [
                        endpoint.key,
                        getArray(result, endpoint.keys)
                    ];
                } catch (error) {
                    console.error(
                        `Failed to load ${endpoint.url}:`,
                        error
                    );

                    return [endpoint.key, []];
                }
            })
        );

        results.forEach(([key, records]) => {
            if (key === 'students') students = records;
            if (key === 'subjects') subjects = records;
            if (key === 'teachers') teachers = records;
            if (key === 'semesters') semesters = records;
            if (key === 'yearLevels') yearLevels = records;
            if (key === 'courses') courses = records;
        });

        fillSelect(
            studentSelect,
            students,
            'student_id',
            getFullName,
            'Select student'
        );

        fillSelect(
            subjectSelect,
            subjects,
            'subject_id',
            subject => subject.subject_code
                ? `${subject.subject_code} - ${subject.subject_name || ''}`
                : subject.subject_name || `Subject #${subject.subject_id}`,
            'Select subject'
        );

        fillSelect(
            teacherSelect,
            teachers,
            'teacher_id',
            getFullName,
            'Select teacher'
        );

        fillSelect(
            semesterSelect,
            semesters,
            'semester_id',
            semester => [
                semester.semester_name,
                semester.academic_year
            ].filter(Boolean).join(' - ') || `Semester #${semester.semester_id}`,
            'Select semester'
        );

        fillSelect(
            yearLevelSelect,
            yearLevels,
            'year_level_id',
            year => year.year_level_name || `Year Level #${year.year_level_id}`,
            'Select year level'
        );

        fillSelect(
            courseSelect,
            courses,
            'course_id',
            course => `${course.course_code || ''} ${course.course_name || ''}`.trim(),
            'Select course'
        );
    }

    async function loadEnrollments() {
        enrollmentTable.innerHTML = `
            <tr>
                <td colspan="12">Loading enrollment records...</td>
            </tr>
        `;

        clearMessage(pageMessage);

        try {
            const result = await apiRequest('/loadslips');

            enrollments = getArray(result, ['loadslips', 'enrollments']);

            renderEnrollments();

            if (enrollments.length === 0) {
                showMessage(pageMessage, 'No enrollment records found.');
            }

        } catch (error) {
            console.error('Enrollment loading error:', error);

            enrollments = [];
            updateSummary();

            enrollmentTable.innerHTML = `
                <tr>
                    <td colspan="12">Unable to load enrollment records.</td>
                </tr>
            `;

            showMessage(
                pageMessage,
                `Could not load enrollment records: ${error.message}`,
                true
            );
        }
    }

    function updateSummary(records = enrollments) {
        totalEnrollments.textContent = records.length;

        enrolledCount.textContent = records.filter(record =>
            String(record.enrollment_status).toLowerCase() === 'enrolled'
        ).length;

        pendingCount.textContent = records.filter(record =>
            String(record.enrollment_status).toLowerCase() === 'pending'
        ).length;
    }

    function renderEnrollments(records = enrollments) {
        updateSummary(records);

        if (records.length === 0) {
            enrollmentTable.innerHTML = `
                <tr>
                    <td colspan="12">No enrollment records to display.</td>
                </tr>
            `;
            return;
        }

        enrollmentTable.innerHTML = records.map(record => {
            const status = record.enrollment_status || 'Not specified';

            return `
                <tr>
                    <td>${escapeHTML(record.loadslip_id)}</td>
                    <td>${escapeHTML(getStudentName(record.student_id))}</td>
                    <td>${escapeHTML(getSubjectName(record.subject_id))}</td>
                    <td>${escapeHTML(getTeacherName(record.teacher_id))}</td>
                    <td>${escapeHTML(getSemesterName(record.semester_id))}</td>
                    <td>${escapeHTML(getYearLevelName(record.year_level_id))}</td>
                    <td>${escapeHTML(getCourseName(record.course_id))}</td>
                    <td>${escapeHTML(record.school_year || '—')}</td>
                    <td>${escapeHTML(record.section || '—')}</td>
                    <td>
                        <span class="status ${getStatusClass(status)}">
                            ${escapeHTML(status)}
                        </span>
                    </td>
                    <td>${escapeHTML(formatDate(record.date_enrolled))}</td>
                    <td class="action-column">
                        <button
                            type="button"
                            class="btn-edit"
                            data-action="edit"
                            data-id="${escapeHTML(record.loadslip_id)}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="btn-delete"
                            data-action="delete"
                            data-id="${escapeHTML(record.loadslip_id)}"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function searchEnrollments() {
        const keyword = searchInput.value.toLowerCase().trim();

        const filtered = enrollments.filter(record => {
            const searchableText = [
                record.loadslip_id,
                getStudentName(record.student_id),
                getSubjectName(record.subject_id),
                getTeacherName(record.teacher_id),
                getSemesterName(record.semester_id),
                getYearLevelName(record.year_level_id),
                getCourseName(record.course_id),
                record.school_year,
                record.section,
                record.enrollment_status,
                record.date_enrolled
            ].join(' ').toLowerCase();

            return searchableText.includes(keyword);
        });

        renderEnrollments(filtered);
    }

    function openModal() {
        overlay.classList.add('show');
        clearMessage(formMessage);
    }

    function closeModal() {
        overlay.classList.remove('show');
        enrollmentForm.reset();
        enrollmentId.value = '';
        clearMessage(formMessage);
    }

    function resetForm() {
        enrollmentForm.reset();
        enrollmentId.value = '';
        statusSelect.value = 'Enrolled';
        dateInput.value = new Date().toISOString().slice(0, 10);
        clearMessage(formMessage);
    }

    function openAddModal() {
        resetForm();
        modalTitle.textContent = 'Add Enrollment';
        openModal();
    }

    function openEditModal(id) {
        const record = findRecord(enrollments, id, 'loadslip_id');

        if (!record) {
            showMessage(pageMessage, 'Enrollment record not found.', true);
            return;
        }

        resetForm();

        modalTitle.textContent = 'Edit Enrollment';

        enrollmentId.value = record.loadslip_id;
        studentSelect.value = record.student_id;
        subjectSelect.value = record.subject_id;
        teacherSelect.value = record.teacher_id;
        semesterSelect.value = record.semester_id;
        yearLevelSelect.value = record.year_level_id;
        courseSelect.value = record.course_id;

        schoolYearInput.value = record.school_year || '';
        sectionInput.value = record.section || '';
        statusSelect.value = record.enrollment_status || 'Enrolled';
        dateInput.value = formatDate(record.date_enrolled) === '—'
            ? ''
            : formatDate(record.date_enrolled);

        openModal();
    }

    enrollmentForm.addEventListener('submit', async event => {
        event.preventDefault();

        clearMessage(formMessage);

        const id = enrollmentId.value;

        const enrollmentData = {
            student_id: studentSelect.value,
            subject_id: subjectSelect.value,
            teacher_id: teacherSelect.value,
            semester_id: semesterSelect.value,
            year_level_id: yearLevelSelect.value,
            course_id: courseSelect.value,
            school_year: schoolYearInput.value.trim(),
            section: sectionInput.value.trim(),
            enrollment_status: statusSelect.value,
            date_enrolled: dateInput.value
        };

        if (
            !enrollmentData.student_id ||
            !enrollmentData.subject_id ||
            !enrollmentData.teacher_id ||
            !enrollmentData.semester_id ||
            !enrollmentData.year_level_id ||
            !enrollmentData.course_id
        ) {
            showMessage(
                formMessage,
                'Please select all required dropdown fields.',
                true
            );
            return;
        }

        try {
            const endpoint = id
                ? `/loadslips/${encodeURIComponent(id)}`
                : '/loadslips';

            const method = id ? 'PUT' : 'POST';

            await apiRequest(endpoint, {
                method,
                body: JSON.stringify(enrollmentData)
            });

            closeModal();

            await loadEnrollments();

            showMessage(
                pageMessage,
                id
                    ? 'Enrollment updated successfully.'
                    : 'Enrollment added successfully.'
            );

        } catch (error) {
            console.error('Saving enrollment error:', error);

            showMessage(
                formMessage,
                `Could not save enrollment: ${error.message}`,
                true
            );
        }
    });

    async function deleteEnrollment(id) {
        const confirmed = confirm(
            'Are you sure you want to delete this enrollment record?'
        );

        if (!confirmed) return;

        try {
            await apiRequest(`/loadslips/${encodeURIComponent(id)}`, {
                method: 'DELETE'
            });

            await loadEnrollments();

            showMessage(
                pageMessage,
                'Enrollment deleted successfully.'
            );

        } catch (error) {
            console.error('Delete enrollment error:', error);

            showMessage(
                pageMessage,
                `Could not delete enrollment: ${error.message}`,
                true
            );
        }
    }

    enrollmentTable.addEventListener('click', event => {
        const button = event.target.closest('[data-action]');

        if (!button) return;

        const id = button.dataset.id;

        if (button.dataset.action === 'edit') {
            openEditModal(id);
        }

        if (button.dataset.action === 'delete') {
            deleteEnrollment(id);
        }
    });

    document.getElementById('addBtn').addEventListener('click', () => {
        openAddModal();
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        closeModal();
    });

    document.getElementById('refreshBtn').addEventListener('click', async () => {
        await loadDropdownData();
        await loadEnrollments();

        showMessage(pageMessage, 'Enrollment records refreshed.');
    });

    document.getElementById('printBtn').addEventListener('click', () => {
        if (enrollments.length === 0) {
            showMessage(pageMessage, 'There are no enrollment records to print.', true);
            return;
        }

        window.print();
    });

    document.getElementById('backDashboardBtn').addEventListener('click', () => {
        window.location.href = './admin-dashboard.html';
    });

    searchInput.addEventListener('input', searchEnrollments);

    overlay.addEventListener('click', event => {
        if (event.target === overlay) {
            closeModal();
        }
    });

    async function initializePage() {
        await loadDropdownData();
        await loadEnrollments();
    }

    initializePage();

});