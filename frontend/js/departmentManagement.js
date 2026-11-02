const loggedUser = JSON.parse(sessionStorage.getItem('user'));

if (!loggedUser || loggedUser.role !== 'Admin') {
  window.location.href = 'login.html';
}

document.getElementById('welcome').textContent = 'Logged in as ' + loggedUser.username;

function showMessage(box, text, type) {
  box.textContent = text;
  box.className = 'message ' + type;
}

function makeRow(values, onEdit, onDelete) {
  const row = document.createElement('tr');

  values.forEach(function (value) {
    const cell = document.createElement('td');
    cell.textContent = value === null ? '' : value;
    row.appendChild(cell);
  });

  const actions = document.createElement('td');

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'btn-small';
  editBtn.addEventListener('click', onEdit);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'btn-small btn-delete';
  deleteBtn.addEventListener('click', onDelete);

  actions.appendChild(editBtn);
  actions.appendChild(document.createTextNode(' '));
  actions.appendChild(deleteBtn);
  row.appendChild(actions);

  return row;
}

function makeEmptyRow(columns) {
  const row = document.createElement('tr');
  const cell = document.createElement('td');
  cell.colSpan = columns;
  cell.textContent = 'No records found.';
  row.appendChild(cell);
  return row;
}

const deptTable = document.getElementById('deptTable');
const deptSearch = document.getElementById('deptSearch');
const deptPageMessage = document.getElementById('deptPageMessage');
const deptOverlay = document.getElementById('deptOverlay');
const deptModalTitle = document.getElementById('deptModalTitle');
const deptForm = document.getElementById('deptForm');
const deptFormMessage = document.getElementById('deptFormMessage');
const deptIdInput = document.getElementById('deptId');
const deptCodeInput = document.getElementById('deptCode');
const deptNameInput = document.getElementById('deptName');
const deptDescInput = document.getElementById('deptDescription');

let allDepartments = [];

async function loadDepartments() {
  try {
    const response = await fetch(API_URL + '/departments');
    const data = await response.json();

    if (!response.ok) {
      showMessage(deptPageMessage, data.message, 'error');
      return;
    }

    allDepartments = data;
    showDepartments(allDepartments);
  } catch (error) {
    showMessage(deptPageMessage, 'Cannot reach the server. Is the backend running?', 'error');
  }
}

function showDepartments(list) {
  deptTable.innerHTML = '';

  if (list.length === 0) {
    deptTable.appendChild(makeEmptyRow(5));
    return;
  }

  list.forEach(function (d) {
    const row = makeRow(
      [d.department_id, d.department_code, d.department_name, d.description],
      function () { openDeptForm(d); },
      function () { deleteDepartment(d); }
    );
    deptTable.appendChild(row);
  });
}

deptSearch.addEventListener('input', function () {
  const text = deptSearch.value.toLowerCase();

  const filtered = allDepartments.filter(function (d) {
    return (
      d.department_code.toLowerCase().includes(text) ||
      d.department_name.toLowerCase().includes(text)
    );
  });

  showDepartments(filtered);
});

function openDeptForm(d) {
  deptFormMessage.className = 'message';
  deptForm.reset();

  if (d) {
    deptModalTitle.textContent = 'Edit department';
    deptIdInput.value = d.department_id;
    deptCodeInput.value = d.department_code;
    deptNameInput.value = d.department_name;
    deptDescInput.value = d.description || '';
  } else {
    deptModalTitle.textContent = 'Add department';
    deptIdInput.value = '';
  }

  deptOverlay.classList.add('show');
}

function closeDeptForm() {
  deptOverlay.classList.remove('show');
}

document.getElementById('deptAddBtn').addEventListener('click', function () {
  openDeptForm(null);
});
document.getElementById('deptCancelBtn').addEventListener('click', closeDeptForm);

deptForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const id = deptIdInput.value;
  const code = deptCodeInput.value.trim();
  const name = deptNameInput.value.trim();

  if (code === '' || name === '') {
    showMessage(deptFormMessage, 'Department code and name are required.', 'error');
    return;
  }

  const body = {
    department_code: code,
    department_name: name,
    description: deptDescInput.value.trim()
  };

  let url = API_URL + '/departments';
  let method = 'POST';
  if (id !== '') {
    url = API_URL + '/departments/' + id;
    method = 'PUT';
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();

    if (!response.ok) {
      showMessage(deptFormMessage, data.message, 'error');
      return;
    }

    closeDeptForm();
    showMessage(deptPageMessage, data.message, 'success');
    loadDepartments();
  } catch (error) {
    showMessage(deptFormMessage, 'Cannot reach the server. Is the backend running?', 'error');
  }
});

async function deleteDepartment(d) {
  if (!confirm('Delete department "' + d.department_name + '"?')) {
    return;
  }

  try {
    const response = await fetch(API_URL + '/departments/' + d.department_id, {
      method: 'DELETE'
    });
    const data = await response.json();

    if (!response.ok) {
      showMessage(deptPageMessage, data.message, 'error');
      return;
    }

    showMessage(deptPageMessage, data.message, 'success');
    loadDepartments();
  } catch (error) {
    showMessage(deptPageMessage, 'Cannot reach the server. Is the backend running?', 'error');
  }
}

const yearTable = document.getElementById('yearTable');
const yearSearch = document.getElementById('yearSearch');
const yearPageMessage = document.getElementById('yearPageMessage');
const yearOverlay = document.getElementById('yearOverlay');
const yearModalTitle = document.getElementById('yearModalTitle');
const yearForm = document.getElementById('yearForm');
const yearFormMessage = document.getElementById('yearFormMessage');
const yearIdInput = document.getElementById('yearId');
const yearNameInput = document.getElementById('yearName');
const yearDescInput = document.getElementById('yearDescription');

let allYearLevels = [];

async function loadYearLevels() {
  try {
    const response = await fetch(API_URL + '/yearlevels');
    const data = await response.json();

    if (!response.ok) {
      showMessage(yearPageMessage, data.message, 'error');
      return;
    }

    allYearLevels = data;
    showYearLevels(allYearLevels);
  } catch (error) {
    showMessage(yearPageMessage, 'Cannot reach the server. Is the backend running?', 'error');
  }
}

function showYearLevels(list) {
  yearTable.innerHTML = '';

  if (list.length === 0) {
    yearTable.appendChild(makeEmptyRow(4));
    return;
  }

  list.forEach(function (y) {
    const row = makeRow(
      [y.year_level_id, y.year_level_name, y.description],
      function () { openYearForm(y); },
      function () { deleteYearLevel(y); }
    );
    yearTable.appendChild(row);
  });
}

yearSearch.addEventListener('input', function () {
  const text = yearSearch.value.toLowerCase();

  const filtered = allYearLevels.filter(function (y) {
    return y.year_level_name.toLowerCase().includes(text);
  });

  showYearLevels(filtered);
});

function openYearForm(y) {
  yearFormMessage.className = 'message';
  yearForm.reset();

  if (y) {
    yearModalTitle.textContent = 'Edit year level';
    yearIdInput.value = y.year_level_id;
    yearNameInput.value = y.year_level_name;
    yearDescInput.value = y.description || '';
  } else {
    yearModalTitle.textContent = 'Add year level';
    yearIdInput.value = '';
  }

  yearOverlay.classList.add('show');
}

function closeYearForm() {
  yearOverlay.classList.remove('show');
}

document.getElementById('yearAddBtn').addEventListener('click', function () {
  openYearForm(null);
});
document.getElementById('yearCancelBtn').addEventListener('click', closeYearForm);

yearForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const id = yearIdInput.value;
  const name = yearNameInput.value.trim();

  if (name === '') {
    showMessage(yearFormMessage, 'Year level name is required.', 'error');
    return;
  }

  const body = {
    year_level_name: name,
    description: yearDescInput.value.trim()
  };

  let url = API_URL + '/yearlevels';
  let method = 'POST';
  if (id !== '') {
    url = API_URL + '/yearlevels/' + id;
    method = 'PUT';
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();

    if (!response.ok) {
      showMessage(yearFormMessage, data.message, 'error');
      return;
    }

    closeYearForm();
    showMessage(yearPageMessage, data.message, 'success');
    loadYearLevels();
  } catch (error) {
    showMessage(yearFormMessage, 'Cannot reach the server. Is the backend running?', 'error');
  }
});

async function deleteYearLevel(y) {
  if (!confirm('Delete year level "' + y.year_level_name + '"?')) {
    return;
  }

  try {
    const response = await fetch(API_URL + '/yearlevels/' + y.year_level_id, {
      method: 'DELETE'
    });
    const data = await response.json();

    if (!response.ok) {
      showMessage(yearPageMessage, data.message, 'error');
      return;
    }

    showMessage(yearPageMessage, data.message, 'success');
    loadYearLevels();
  } catch (error) {
    showMessage(yearPageMessage, 'Cannot reach the server. Is the backend running?', 'error');
  }
}

document.getElementById('logoutBtn').addEventListener('click', function () {
  sessionStorage.removeItem('user');
  window.location.href = 'login.html';
});

loadDepartments();
loadYearLevels();