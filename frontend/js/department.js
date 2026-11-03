
document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:3000/api';

    const departmentTable =
        document.getElementById('departmentTable');

    const departmentCount =
        document.getElementById('departmentCount');

    const departmentMessage =
        document.getElementById('departmentMessage');

    const departmentSearch =
        document.getElementById('departmentSearch');

    const refreshButton =
        document.getElementById('refreshDepartmentsBtn');

    const printButton =
        document.getElementById('printDepartmentsBtn');

    const backButton =
        document.getElementById('backDashboardBtn');


    let allDepartments = [];

    function escapeHTML(value) {

        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[char]);

    }


    function showMessage(message, type = 'error') {

        departmentMessage.textContent = message;

        departmentMessage.className =
            `department-message ${type} no-print`;

    }

    function clearMessage() {

        departmentMessage.textContent = '';

        departmentMessage.className =
            'department-message no-print';

    }


    function getDepartments(result) {

        if (Array.isArray(result)) {
            return result;
        }

        if (result && Array.isArray(result.data)) {
            return result.data;
        }

        if (result && Array.isArray(result.departments)) {
            return result.departments;
        }

        throw new Error(
            'Unexpected API response. Expected a department records array.'
        );

    }


    function renderDepartments(departments) {

        departmentCount.textContent = departments.length;

        if (departments.length === 0) {

            departmentTable.innerHTML = `
                <tr>
                    <td colspan="4" class="department-empty">
                        No department records found.
                    </td>
                </tr>
            `;

            return;
        }

        departmentTable.innerHTML = departments.map(department => `

            <tr>

                <td>
                    ${escapeHTML(department.department_id)}
                </td>

                <td>
                    ${escapeHTML(department.department_code)}
                </td>

                <td>
                    ${escapeHTML(department.department_name)}
                </td>

                <td>
                    ${escapeHTML(department.description)}
                </td>

            </tr>

        `).join('');

    }


    function searchDepartments() {

        const searchValue =
            departmentSearch.value.trim().toLowerCase();

        const filteredDepartments = allDepartments.filter(department => {

            const id = String(
                department.department_id ?? ''
            ).toLowerCase();

            const code = String(
                department.department_code ?? ''
            ).toLowerCase();

            const name = String(
                department.department_name ?? ''
            ).toLowerCase();

            const description = String(
                department.description ?? ''
            ).toLowerCase();

            return (
                id.includes(searchValue) ||
                code.includes(searchValue) ||
                name.includes(searchValue) ||
                description.includes(searchValue)
            );

        });

        renderDepartments(filteredDepartments);

    }

    async function loadDepartments() {

        clearMessage();

        departmentCount.textContent = 'Loading...';

        departmentTable.innerHTML = `
            <tr>
                <td colspan="4" class="department-empty">
                    Loading department records...
                </td>
            </tr>
        `;

        try {

            const response = await fetch(
                `${API_URL}/departments`
            );

            if (!response.ok) {

                throw new Error(
                    `Backend returned HTTP ${response.status}`
                );

            }

            const result = await response.json();

            allDepartments = getDepartments(result);

            searchDepartments();

        } catch (error) {

            console.error(
                'Department loading error:',
                error
            );

            departmentCount.textContent = 'N/A';

            departmentTable.innerHTML = `
                <tr>
                    <td colspan="4" class="department-empty">
                        Unable to retrieve department records.
                    </td>
                </tr>
            `;

            showMessage(
                error.message +
                '. Please check that your backend server is running and the departments API is available.'
            );

        }

    }

    departmentSearch.addEventListener(
        'input',
        searchDepartments
    );

    refreshButton.addEventListener('click', () => {

        loadDepartments();

    });

    printButton.addEventListener('click', () => {

        if (allDepartments.length === 0) {

            showMessage(
                'There are no department records available to print.'
            );

            return;
        }

        window.print();

    });

    backButton.addEventListener('click', () => {

        window.location.href = './admin-dashboard.html';

    });

    loadDepartments();

});
