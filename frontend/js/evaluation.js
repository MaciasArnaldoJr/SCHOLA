const API_URL = 'http://localhost:3000/api';


const activityTable = document.getElementById('activityTable');
const scoreTable = document.getElementById('scoreTable');

const totalActivities = document.getElementById('totalActivities');
const totalScores = document.getElementById('totalScores');
const averagePercentage = document.getElementById('averagePercentage');

const activitySearch = document.getElementById('activitySearch');
const scoreSearch = document.getElementById('scoreSearch');

const addActivityBtn = document.getElementById('addActivityBtn');
const addScoreBtn = document.getElementById('addScoreBtn');

const refreshBtn = document.getElementById('refreshBtn');
const printBtn = document.getElementById('printBtn');

const pageMessage = document.getElementById('pageMessage');

const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalFields = document.getElementById('modalFields');

const evaluationForm = document.getElementById('evaluationForm');
const formMessage = document.getElementById('formMessage');

const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');


let activities = [];
let scores = [];
let students = [];
let loadslips = [];

let currentMode = '';
let currentId = null;


async function apiRequest(endpoint, options = {}) {

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            result?.error ||
            result?.message ||
            `Request failed: ${response.status}`
        );
    }

    return result;
}


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


function escapeHTML(value) {

    return String(value ?? '').replace(/[&<>"']/g, character => {

        const characters = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return characters[character];
    });
}


function showPageMessage(message, type = 'success') {

    pageMessage.textContent = message;
    pageMessage.className = `message ${type}`;

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function clearPageMessage() {

    pageMessage.textContent = '';
    pageMessage.className = 'message';
}

function showFormMessage(message, type = 'error') {

    formMessage.textContent = message;
    formMessage.className = `message ${type}`;
}


function formatDate(value) {

    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return escapeHTML(value);
    }

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(value) {

    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
    );

    return localDate.toISOString().slice(0, 16);
}

async function loadDropdownData() {

    const results = await Promise.allSettled([
        apiRequest('/students'),
        apiRequest('/loadslips')
    ]);

    if (results[0].status === 'fulfilled') {
        students = getArray(results[0].value, 'students');
    } else {
        console.error('Unable to load students:', results[0].reason);
        students = [];
    }

    if (results[1].status === 'fulfilled') {
        loadslips = getArray(results[1].value, 'loadslips');
    } else {
        console.error('Unable to load load slips:', results[1].reason);
        loadslips = [];
    }
}


async function loadActivities() {

    try {

        const result = await apiRequest('/activities');

        activities = getArray(result, 'activities');

        renderActivities();

    } catch (error) {

        console.error('Activity loading error:', error);

        activities = [];

        activityTable.innerHTML = `
            <tr>
                <td colspan="6" class="table-empty">
                    Unable to load activities. Check your backend server.
                </td>
            </tr>
        `;

        totalActivities.textContent = '—';

        showPageMessage(
            `Unable to load activities: ${error.message}`,
            'error'
        );
    }
}

async function loadScores() {

    try {

        const result = await apiRequest('/scores');

        scores = getArray(result, 'scores');

        renderScores();

    } catch (error) {

        console.error('Score loading error:', error);

        scores = [];

        scoreTable.innerHTML = `
            <tr>
                <td colspan="8" class="table-empty">
                    Unable to load scores. Check your backend server.
                </td>
            </tr>
        `;

        totalScores.textContent = '—';
        averagePercentage.textContent = '—';

        showPageMessage(
            `Unable to load scores: ${error.message}`,
            'error'
        );
    }
}


async function loadEvaluationData() {

    clearPageMessage();

    await loadDropdownData();

    await Promise.all([
        loadActivities(),
        loadScores()
    ]);

}

function renderActivities() {

    const search = activitySearch.value.toLowerCase().trim();

    const filteredActivities = activities.filter(activity => {

        return [
            activity.activity_id,
            activity.activity_title,
            activity.activity_type,
            activity.total_points,
            activity.due_date
        ].some(value =>
            String(value ?? '').toLowerCase().includes(search)
        );

    });

    totalActivities.textContent = activities.length;

    if (filteredActivities.length === 0) {

        activityTable.innerHTML = `
            <tr>
                <td colspan="6" class="table-empty">
                    No activities found.
                </td>
            </tr>
        `;

        return;
    }

    activityTable.innerHTML = filteredActivities.map(activity => {

        return `
            <tr>

                <td>${escapeHTML(activity.activity_id)}</td>

                <td>
                    <strong>
                        ${escapeHTML(activity.activity_title)}
                    </strong>
                </td>

                <td>
                    <span class="type-badge">
                        ${escapeHTML(activity.activity_type || 'Other')}
                    </span>
                </td>

                <td>
                    ${escapeHTML(activity.total_points)}
                </td>

                <td>
                    ${formatDate(activity.due_date)}
                </td>

                <td class="action-column">

                    <button
                        class="btn btn-primary btn-small"
                        data-action="edit-activity"
                        data-id="${escapeHTML(activity.activity_id)}"
                        type="button">
                        Edit
                    </button>

                    <button
                        class="btn btn-danger btn-small"
                        data-action="delete-activity"
                        data-id="${escapeHTML(activity.activity_id)}"
                        type="button">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    }).join('');

}

function renderScores() {

    const search = scoreSearch.value.toLowerCase().trim();

    const filteredScores = scores.filter(score => {

        const percentage = calculatePercentage(score);

        return [
            score.score_id,
            score.activity_title,
            score.student_name,
            score.points_earned,
            percentage,
            score.remarks,
            score.date_graded
        ].some(value =>
            String(value ?? '').toLowerCase().includes(search)
        );

    });

    totalScores.textContent = scores.length;

    const percentages = scores
        .map(score => calculatePercentage(score))
        .filter(value => Number.isFinite(value));

    const average = percentages.length
        ? percentages.reduce((sum, value) => sum + value, 0) /
          percentages.length
        : 0;

    averagePercentage.textContent = `${average.toFixed(1)}%`;

    if (filteredScores.length === 0) {

        scoreTable.innerHTML = `
            <tr>
                <td colspan="8" class="table-empty">
                    No scores found.
                </td>
            </tr>
        `;

        return;
    }

    scoreTable.innerHTML = filteredScores.map(score => {

        const percentage = calculatePercentage(score);

        return `
            <tr>

                <td>
                    ${escapeHTML(score.score_id)}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(score.activity_title || 'Unknown Activity')}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(score.student_name || 'Unknown Student')}
                </td>

                <td>
                    ${escapeHTML(score.points_earned)}
                    /
                    ${escapeHTML(score.total_points)}
                </td>

                <td>
                    <span class="percentage">
                        ${percentage.toFixed(1)}%
                    </span>
                </td>

                <td>
                    ${escapeHTML(score.remarks || '—')}
                </td>

                <td>
                    ${formatDate(score.date_graded)}
                </td>

                <td class="action-column">

                    <button
                        class="btn btn-primary btn-small"
                        data-action="edit-score"
                        data-id="${escapeHTML(score.score_id)}"
                        type="button">
                        Edit
                    </button>

                    <button
                        class="btn btn-danger btn-small"
                        data-action="delete-score"
                        data-id="${escapeHTML(score.score_id)}"
                        type="button">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    }).join('');

}

function calculatePercentage(score) {

    const earned = Number(score.points_earned);
    const total = Number(score.total_points);

    if (!Number.isFinite(earned) || !Number.isFinite(total) || total <= 0) {
        return 0;
    }

    return (earned / total) * 100;
}

function getLoadslipOptions(selectedId = '') {

    if (loadslips.length === 0) {

        return `
            <option value="">
                No load slips available
            </option>
        `;
    }

    return `
        <option value="">Select a load slip</option>

        ${loadslips.map(loadslip => {

            const student = students.find(item =>
                String(item.student_id) === String(loadslip.student_id)
            );

            const studentName = student
                ? `${student.fname || ''} ${student.lname || ''}`.trim()
                : `Student ID ${loadslip.student_id}`;

            const label =
                `Load Slip #${loadslip.loadslip_id} - ${studentName}`;

            return `
                <option
                    value="${escapeHTML(loadslip.loadslip_id)}"
                    ${String(loadslip.loadslip_id) === String(selectedId) ? 'selected' : ''}>
                    ${escapeHTML(label)}
                </option>
            `;

        }).join('')}
    `;
}

function getActivityOptions(selectedId = '') {

    return `
        <option value="">Select an activity</option>

        ${activities.map(activity => `

            <option
                value="${escapeHTML(activity.activity_id)}"
                ${String(activity.activity_id) === String(selectedId) ? 'selected' : ''}>

                ${escapeHTML(activity.activity_title)}
                (${escapeHTML(activity.total_points)} points)

            </option>

        `).join('')}
    `;
}

function getStudentOptions(selectedId = '') {

    return `
        <option value="">Select a student</option>

        ${students.map(student => {

            const name =
                `${student.fname || ''} ${student.lname || ''}`.trim();

            return `
                <option
                    value="${escapeHTML(student.student_id)}"
                    ${String(student.student_id) === String(selectedId) ? 'selected' : ''}>

                    ${escapeHTML(name || `Student ${student.student_id}`)}

                </option>
            `;

        }).join('')}
    `;
}


function openModal() {

    modalOverlay.classList.add('show');
    formMessage.textContent = '';
    formMessage.className = 'message';

}

function closeModal() {

    modalOverlay.classList.remove('show');

    evaluationForm.reset();

    modalFields.innerHTML = '';

    currentMode = '';
    currentId = null;

}


function openAddActivityModal() {

    currentMode = 'add-activity';
    currentId = null;

    modalTitle.textContent = 'Add New Activity';

    modalFields.innerHTML = `

        <div class="form-group">

            <label for="activityLoadslip">
                Load Slip *
            </label>

            <select
                id="activityLoadslip"
                class="form-control"
                required>

                ${getLoadslipOptions()}

            </select>

        </div>

        <div class="form-group">

            <label for="activityTitle">
                Activity Title *
            </label>

            <input
                type="text"
                id="activityTitle"
                class="form-control"
                required
                placeholder="Enter activity title">

        </div>

        <div class="form-group">

            <label for="activityType">
                Activity Type *
            </label>

            <select
                id="activityType"
                class="form-control"
                required>

                <option value="">Select type</option>
                <option value="Quiz">Quiz</option>
                <option value="Assignment">Assignment</option>
                <option value="Performance Task">Performance Task</option>

            </select>

        </div>

        <div class="form-group">

            <label for="activityInstructions">
                Instructions
            </label>

            <textarea
                id="activityInstructions"
                class="form-control"
                placeholder="Enter activity instructions"></textarea>

        </div>

        <div class="form-group">

            <label for="activityPoints">
                Total Points *
            </label>

            <input
                type="number"
                id="activityPoints"
                class="form-control"
                min="1"
                step="any"
                required>

        </div>

        <div class="form-group">

            <label for="activityDueDate">
                Due Date
            </label>

            <input
                type="datetime-local"
                id="activityDueDate"
                class="form-control">

        </div>

        <div class="form-group">

            <label for="activityStatus">
                Status
            </label>

            <select
                id="activityStatus"
                class="form-control">

                <option value="Active">Active</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>

            </select>

        </div>

    `;

    saveBtn.textContent = 'Save Activity';

    openModal();

}

function openEditActivityModal(id) {

    const activity = activities.find(item =>
        String(item.activity_id) === String(id)
    );

    if (!activity) {
        return;
    }

    currentMode = 'edit-activity';
    currentId = id;

    modalTitle.textContent = 'Edit Activity';

    modalFields.innerHTML = `

        <div class="form-group">

            <label for="activityLoadslip">
                Load Slip *
            </label>

            <select
                id="activityLoadslip"
                class="form-control"
                required>

                ${getLoadslipOptions(activity.loadslip_id)}

            </select>

        </div>

        <div class="form-group">

            <label for="activityTitle">
                Activity Title *
            </label>

            <input
                type="text"
                id="activityTitle"
                class="form-control"
                value="${escapeHTML(activity.activity_title)}"
                required>

        </div>

        <div class="form-group">

            <label for="activityType">
                Activity Type
            </label>

            <select
                id="activityType"
                class="form-control">

                <option value="Quiz" ${activity.activity_type === 'Quiz' ? 'selected' : ''}>Quiz</option>
                <option value="Assignment" ${activity.activity_type === 'Assignment' ? 'selected' : ''}>Assignment</option>
                <option value="Performance Task" ${activity.activity_type === 'Performance Task' ? 'selected' : ''}>Performance Task</option>

            </select>

        </div>

        <div class="form-group">

            <label for="activityInstructions">
                Instructions
            </label>

            <textarea
                id="activityInstructions"
                class="form-control">${escapeHTML(activity.instructions || '')}</textarea>

        </div>

        <div class="form-group">

            <label for="activityPoints">
                Total Points *
            </label>

            <input
                type="number"
                id="activityPoints"
                class="form-control"
                min="1"
                step="any"
                value="${escapeHTML(activity.total_points)}"
                required>

        </div>

        <div class="form-group">

            <label for="activityDueDate">
                Due Date
            </label>

            <input
                type="datetime-local"
                id="activityDueDate"
                class="form-control"
                value="${formatDateTime(activity.due_date)}">

        </div>

        <div class="form-group">

            <label for="activityStatus">
                Status
            </label>

            <select
                id="activityStatus"
                class="form-control">

                <option value="Active" ${activity.status === 'Active' ? 'selected' : ''}>Active</option>
                <option value="Open" ${activity.status === 'Open' ? 'selected' : ''}>Open</option>
                <option value="Closed" ${activity.status === 'Closed' ? 'selected' : ''}>Closed</option>

            </select>

        </div>

    `;

    saveBtn.textContent = 'Update Activity';

    openModal();

}

function openAddScoreModal() {

    if (activities.length === 0) {
        showPageMessage(
            'Please add an activity before recording a score.',
            'error'
        );
        return;
    }

    if (students.length === 0) {
        showPageMessage(
            'No students are available. Please check your Students API.',
            'error'
        );
        return;
    }

    currentMode = 'add-score';
    currentId = null;

    modalTitle.textContent = 'Add Student Score';

    modalFields.innerHTML = `

        <div class="form-group">

            <label for="scoreActivity">
                Activity *
            </label>

            <select
                id="scoreActivity"
                class="form-control"
                required>

                ${getActivityOptions()}

            </select>

        </div>

        <div class="form-group">

            <label for="scoreStudent">
                Student *
            </label>

            <select
                id="scoreStudent"
                class="form-control"
                required>

                ${getStudentOptions()}

            </select>

        </div>

        <div class="form-group">

            <label for="pointsEarned">
                Points Earned *
            </label>

            <input
                type="number"
                id="pointsEarned"
                class="form-control"
                min="0"
                step="any"
                required>

            <small style="color:#64748b;font-size:11px;">
                Maximum points depend on the selected activity.
            </small>

        </div>

        <div class="form-group">

            <label for="scoreRemarks">
                Remarks
            </label>

            <textarea
                id="scoreRemarks"
                class="form-control"
                placeholder="Enter remarks"></textarea>

        </div>

        <div class="form-group">

            <label for="gradedBy">
                Graded By (User ID)
            </label>

            <input
                type="number"
                id="gradedBy"
                class="form-control"
                min="1"
                placeholder="Optional">

        </div>

    `;

    saveBtn.textContent = 'Save Score';

    openModal();

    document.getElementById('scoreActivity')
        .addEventListener('change', updatePointsLimit);

}

function updatePointsLimit() {

    const activityId =
        document.getElementById('scoreActivity').value;

    const activity = activities.find(item =>
        String(item.activity_id) === String(activityId)
    );

    const pointsInput = document.getElementById('pointsEarned');

    if (activity) {

        pointsInput.max = activity.total_points;

        pointsInput.placeholder =
            `Maximum: ${activity.total_points}`;

    } else {

        pointsInput.removeAttribute('max');
        pointsInput.placeholder = '';

    }

}

function openEditScoreModal(id) {

    const score = scores.find(item =>
        String(item.score_id) === String(id)
    );

    if (!score) {
        return;
    }

    currentMode = 'edit-score';
    currentId = id;

    modalTitle.textContent = 'Edit Student Score';

    modalFields.innerHTML = `

        <div class="form-group">

            <label>Activity</label>

            <input
                type="text"
                class="form-control"
                value="${escapeHTML(score.activity_title)}"
                disabled>

        </div>

        <div class="form-group">

            <label>Student</label>

            <input
                type="text"
                class="form-control"
                value="${escapeHTML(score.student_name)}"
                disabled>

        </div>

        <div class="form-group">

            <label for="pointsEarned">
                Points Earned *
            </label>

            <input
                type="number"
                id="pointsEarned"
                class="form-control"
                min="0"
                max="${escapeHTML(score.total_points)}"
                step="any"
                value="${escapeHTML(score.points_earned)}"
                required>

        </div>

        <div class="form-group">

            <label for="scoreRemarks">
                Remarks
            </label>

            <textarea
                id="scoreRemarks"
                class="form-control">${escapeHTML(score.remarks || '')}</textarea>

        </div>

        <div class="form-group">

            <label for="gradedBy">
                Graded By (User ID)
            </label>

            <input
                type="number"
                id="gradedBy"
                class="form-control"
                min="1"
                placeholder="Optional">

        </div>

        <small style="color:#64748b;">
            Your backend keeps the original Activity and Student when editing a score.
        </small>

    `;

    saveBtn.textContent = 'Update Score';

    openModal();

}

async function saveActivity() {

    const loadslipId =
        document.getElementById('activityLoadslip').value;

    const activityTitle =
        document.getElementById('activityTitle').value.trim();

    const activityType =
        document.getElementById('activityType').value;

    const instructions =
        document.getElementById('activityInstructions').value.trim();

    const totalPoints =
        Number(document.getElementById('activityPoints').value);

    const dueDate =
        document.getElementById('activityDueDate').value;

    const status =
        document.getElementById('activityStatus').value;

    if (!loadslipId || !activityTitle || !activityType ||
        !Number.isFinite(totalPoints) || totalPoints <= 0) {

        showFormMessage('Please complete all required activity fields.');
        return;
    }

    const payload = {

        loadslip_id: Number(loadslipId),
        activity_title: activityTitle,
        activity_type: activityType,
        instructions: instructions,
        total_points: totalPoints,
        due_date: dueDate
            ? dueDate.replace('T', ' ') + ':00'
            : null,
        status: status

    };

    try {

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        if (currentMode === 'add-activity') {

            await apiRequest('/activities', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            closeModal();

            await loadActivities();

            showPageMessage('Activity successfully added.');

        } else if (currentMode === 'edit-activity') {

            await apiRequest(`/activities/${currentId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            closeModal();

            await loadActivities();

            showPageMessage('Activity successfully updated.');

        }

    } catch (error) {

        console.error('Save activity error:', error);

        showFormMessage(error.message);

    } finally {

        saveBtn.disabled = false;

        saveBtn.textContent =
            currentMode === 'edit-activity'
                ? 'Update Activity'
                : 'Save Activity';

    }

}

async function saveScore() {

    const pointsEarned =
        Number(document.getElementById('pointsEarned').value);

    const remarks =
        document.getElementById('scoreRemarks').value.trim();

    const gradedByInput =
        document.getElementById('gradedBy');

    const gradedBy =
        gradedByInput.value.trim();

    if (!Number.isFinite(pointsEarned) || pointsEarned < 0) {

        showFormMessage('Enter a valid points-earned value.');
        return;
    }

    if (currentMode === 'add-score') {

        const activityId =
            document.getElementById('scoreActivity').value;

        const studentId =
            document.getElementById('scoreStudent').value;

        if (!activityId || !studentId) {

            showFormMessage('Please select an activity and student.');
            return;
        }

        const selectedActivity = activities.find(item =>
            String(item.activity_id) === String(activityId)
        );

        if (
            !selectedActivity ||
            pointsEarned > Number(selectedActivity.total_points)
        ) {

            showFormMessage('Points earned cannot exceed the activity total points.');
            return;
        }

    } else if (currentMode === 'edit-score') {

        const existingScore = scores.find(item =>
            String(item.score_id) === String(currentId)
        );

        if (
            existingScore &&
            pointsEarned > Number(existingScore.total_points)
        ) {

            showFormMessage('Points earned cannot exceed the activity total points.');
            return;
        }

    }

    const payload = {

        points_earned: pointsEarned,
        remarks: remarks,
        graded_by: gradedBy ? Number(gradedBy) : null

    };

    try {

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        if (currentMode === 'add-score') {

            payload.activity_id = Number(
                document.getElementById('scoreActivity').value
            );

            payload.student_id = Number(
                document.getElementById('scoreStudent').value
            );

            await apiRequest('/scores', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            closeModal();

            await loadScores();

            showPageMessage('Student score successfully added.');

        } else if (currentMode === 'edit-score') {

            await apiRequest(`/scores/${currentId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            closeModal();

            await loadScores();

            showPageMessage('Student score successfully updated.');

        }

    } catch (error) {

        console.error('Save score error:', error);

        showFormMessage(error.message);

    } finally {

        saveBtn.disabled = false;

        saveBtn.textContent =
            currentMode === 'edit-score'
                ? 'Update Score'
                : 'Save Score';

    }

}

async function deleteActivity(id) {

    const confirmed = confirm(
        'Are you sure you want to delete this activity?'
    );

    if (!confirmed) {
        return;
    }

    try {

        await apiRequest(`/activities/${id}`, {
            method: 'DELETE'
        });

        await Promise.all([
            loadActivities(),
            loadScores()
        ]);

        showPageMessage('Activity successfully deleted.');

    } catch (error) {

        console.error('Delete activity error:', error);

        showPageMessage(
            `Unable to delete activity: ${error.message}`,
            'error'
        );

    }

}

async function deleteScore(id) {

    const confirmed = confirm(
        'Are you sure you want to delete this score?'
    );

    if (!confirmed) {
        return;
    }

    try {

        await apiRequest(`/scores/${id}`, {
            method: 'DELETE'
        });

        await loadScores();

        showPageMessage('Score successfully deleted.');

    } catch (error) {

        console.error('Delete score error:', error);

        showPageMessage(
            `Unable to delete score: ${error.message}`,
            'error'
        );

    }

}

evaluationForm.addEventListener('submit', async function(event) {

    event.preventDefault();

    if (
        currentMode === 'add-activity' ||
        currentMode === 'edit-activity'
    ) {

        await saveActivity();

    } else if (
        currentMode === 'add-score' ||
        currentMode === 'edit-score'
    ) {

        await saveScore();

    }

});

addActivityBtn.addEventListener('click', openAddActivityModal);

activitySearch.addEventListener('input', renderActivities);

activityTable.addEventListener('click', function(event) {

    const button = event.target.closest('[data-action]');

    if (!button) {
        return;
    }

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === 'edit-activity') {

        openEditActivityModal(id);

    } else if (action === 'delete-activity') {

        deleteActivity(id);

    }

});

addScoreBtn.addEventListener('click', openAddScoreModal);

scoreSearch.addEventListener('input', renderScores);

scoreTable.addEventListener('click', function(event) {

    const button = event.target.closest('[data-action]');

    if (!button) {
        return;
    }

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === 'edit-score') {

        openEditScoreModal(id);

    } else if (action === 'delete-score') {

        deleteScore(id);

    }

});


refreshBtn.addEventListener('click', async function() {

    refreshBtn.disabled = true;
    refreshBtn.textContent = 'Refreshing...';

    await loadEvaluationData();

    refreshBtn.disabled = false;
    refreshBtn.textContent = '↻ Refresh';

    if (!pageMessage.classList.contains('error')) {
        showPageMessage('Evaluation records refreshed.');
    }

});


printBtn.addEventListener('click', function() {

    window.print();

});

cancelBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', function(event) {

    if (event.target === modalOverlay) {
        closeModal();
    }

});

document.addEventListener('DOMContentLoaded', function() {

    console.log('SCHOLA Evaluation Management initialized.');

    loadEvaluationData();

});