
const API_URL = 'http://localhost:3000/api';

const reportEndpoints = {
    departments: '/departments',
    yearlevels: '/yearlevels',
    semesters: '/semesters',
    users: '/users',
    courses: '/courses',
    students: '/students',
    teachers: '/teachers',
    subjects: '/subjects',
    rooms: '/rooms',
    loadslips: '/loadslips',
    schedules: '/schedules',
    activities: '/activities',
    scores: '/scores',
    grades: '/grades',
    attendance: '/attendance',
    learningmaterials: '/learningmaterials'
};

const tableNames = {
    departments: 'Department',
    yearlevels: 'YearLevel',
    semesters: 'Semester',
    users: 'Users',
    courses: 'Course',
    students: 'Students',
    teachers: 'Teachers',
    subjects: 'Subjects',
    rooms: 'Room',
    loadslips: 'Loadslip',
    schedules: 'Schedule',
    activities: 'Activities',
    scores: 'Scores',
    grades: 'Grade',
    attendance: 'Attendance',
    learningmaterials: 'LearningMaterial'
};

let allRecords = [];
let currentTable = '';

const tableSelect = document.getElementById('tableSelect');
const searchInput = document.getElementById('reportSearch');
const tableHead = document.getElementById('reportTableHead');
const tableBody = document.getElementById('reportTableBody');

const selectedTable = document.getElementById('selectedTable');
const totalRecords = document.getElementById('totalRecords');
const displayedRecords = document.getElementById('displayedRecords');
const pageMessage = document.getElementById('pageMessage');

const loadReportBtn = document.getElementById('loadReportBtn');
const refreshBtn = document.getElementById('refreshBtn');
const printBtn = document.getElementById('printBtn');
const backDashboardBtn = document.getElementById('backDashboardBtn');

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showMessage(message, type = '') {
    pageMessage.textContent = message;
    pageMessage.className = 'report-message';

    if (type) {
        pageMessage.classList.add(type);
    }
}

function getRecords(response, selectedKey) {
    if (Array.isArray(response)) {
        return response;
    }

    if (response && Array.isArray(response.data)) {
        return response.data;
    }

    if (response && Array.isArray(response.results)) {
        return response.results;
    }

    if (response && Array.isArray(response[selectedKey])) {
        return response[selectedKey];
    }

    return null;
}

async function fetchReportRecords(key) {
    const endpoint = reportEndpoints[key];

    if (!endpoint) {
        throw new Error('No API endpoint is configured for this table.');
    }

    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `API request failed (${response.status}). ${errorText.slice(0, 200)}`
        );
    }

    const result = await response.json();
    const records = getRecords(result, key);

    if (records === null) {
        throw new Error(
            'The API response is not an array of records. Check your controller response.'
        );
    }

    return records;
}

function getVisibleColumns(records) {
    if (!records.length) {
        return [];
    }

    const columns = [...new Set(
        records.flatMap(record => Object.keys(record))
    )];
    
    return columns.filter(column => column.toLowerCase() !== 'password');
}

function formatCellValue(value) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

function renderTable(records) {
    const columns = getVisibleColumns(records);

    if (!records.length) {
        tableHead.innerHTML = '<tr><th>No Records</th></tr>';
        tableBody.innerHTML = `
            <tr>
                <td class="empty-message">
                    No records were found in this database table.
                </td>
            </tr>
        `;

        displayedRecords.textContent = '0';
        return;
    }

    tableHead.innerHTML = `
        <tr>
            ${columns.map(column => `<th>${escapeHTML(column)}</th>`).join('')}
        </tr>
    `;

    tableBody.innerHTML = records.map(record => `
        <tr>
            ${columns.map(column => `
                <td>${escapeHTML(formatCellValue(record[column]))}</td>
            `).join('')}
        </tr>
    `).join('');

    displayedRecords.textContent = records.length;
}

function filterRecords() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        renderTable(allRecords);
        return;
    }

    const filteredRecords = allRecords.filter(record => {
        return Object.entries(record).some(([key, value]) => {
            // Do not search or display password values.
            if (key.toLowerCase() === 'password') {
                return false;
            }

            return formatCellValue(value)
                .toLowerCase()
                .includes(searchTerm);
        });
    });

    renderTable(filteredRecords);
}

async function loadReport() {
    const key = tableSelect.value;

    currentTable = key;
    searchInput.value = '';

    selectedTable.textContent = tableNames[key] || '—';
    totalRecords.textContent = '0';
    displayedRecords.textContent = '0';

    tableHead.innerHTML = '<tr><th>Loading...</th></tr>';
    tableBody.innerHTML = `
        <tr>
            <td class="empty-message">Retrieving database records...</td>
        </tr>
    `;

    showMessage(`Loading ${tableNames[key]} records...`);

    loadReportBtn.disabled = true;
    refreshBtn.disabled = true;

    try {
        allRecords = await fetchReportRecords(key);

        totalRecords.textContent = allRecords.length;

        renderTable(allRecords);

        showMessage(
            `${tableNames[key]} report loaded successfully.`,
            'success'
        );

    } catch (error) {
        allRecords = [];

        tableHead.innerHTML = '<tr><th>Unable to Load Report</th></tr>';
        tableBody.innerHTML = `
            <tr>
                <td class="empty-message">
                    ${escapeHTML(error.message)}
                </td>
            </tr>
        `;

        totalRecords.textContent = '0';
        displayedRecords.textContent = '0';

        showMessage(
            `Unable to load ${tableNames[key]}: ${error.message}`,
            'error'
        );

        console.error('Reports error:', error);

    } finally {
        loadReportBtn.disabled = false;
        refreshBtn.disabled = false;
    }
}

loadReportBtn.addEventListener('click', loadReport);

refreshBtn.addEventListener('click', loadReport);

tableSelect.addEventListener('change', loadReport);

searchInput.addEventListener('input', filterRecords);

printBtn.addEventListener('click', () => {
    window.print();
});

backDashboardBtn.addEventListener('click', () => {
    window.location.href = 'admin-dashboard.html';
});

document.addEventListener('DOMContentLoaded', () => {
    loadReport();
});
