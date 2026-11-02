const loggedUser = JSON.parse(
  localStorage.getItem('user') || sessionStorage.getItem('user')
);

if (!loggedUser || loggedUser.role !== 'Admin') {
  window.location.href = 'login.html';
}

const welcome = document.getElementById('welcome');
const courseTable = document.getElementById('courseTable');
const reportTable = document.getElementById('reportTable');
const searchInput = document.getElementById('search');
const pageMessage = document.getElementById('pageMessage');
const reportMessage = document.getElementById('reportMessage');

const overlay = document.getElementById('overlay');
const modalTitle = document.getElementById('modalTitle');
const courseForm = document.getElementById('courseForm');
const formMessage = document.getElementById('formMessage');

const courseIdInput = document.getElementById('courseId');
const departmentInput = document.getElementById('department');
const courseCodeInput = document.getElementById('courseCode');
const courseNameInput = document.getElementById('courseName');
const descriptionInput = document.getElementById('description');

let allCourses = [];

welcome.textContent = 'Logged in as ' + loggedUser.username;

function showPageMessage(text, type) {
  pageMessage.textContent = text;
  pageMessage.className = 'message ' + type;
}

function showFormError(text) {
  formMessage.textContent = text;
  formMessage.className = 'message error';
}

async function loadDepartments() {
  try {
    const response = await fetch(API_URL + '/departments');
    const data = await response.json();

    if (!response.ok) {
      showPageMessage(data.message, 'error');
      return;
    }

    departmentInput.innerHTML = '';
    data.forEach(function (d) {
      const option = document.createElement('option');
      option.value = d.department_id;
      option.textContent = d.department_id + ' - ' + d.department_name;
      departmentInput.appendChild(option);
    });
  } catch (error) {
    showPageMessage('Cannot reach the server. Is the backend running?', 'error');
  }
}

async function loadCourses() {
  try {
    const response = await fetch(API_URL + '/courses');
    const data = await response.json();

    if (!response.ok) {
      showPageMessage(data.message, 'error');
      return;
    }

    allCourses = data;
    showCourses(allCourses);
  } catch (error) {
    showPageMessage('Cannot reach the server. Is the backend running?', 'error');
  }
}

function showCourses(courses) {
  courseTable.innerHTML = '';

  if (courses.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.textContent = 'No courses found.';
    row.appendChild(cell);
    courseTable.appendChild(row);
    return;
  }

  courses.forEach(function (course) {
    const row = document.createElement('tr');

    const values = [
      course.course_id,
      course.department_id,
      course.course_code,
      course.course_name,
      course.description || ''
    ];

    values.forEach(function (value) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });

    const actions = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn-small';
    editBtn.addEventListener('click', function () {
      openForm(course);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'btn-small btn-delete';
    deleteBtn.addEventListener('click', function () {
      deleteCourse(course);
    });

    actions.appendChild(editBtn);
    actions.appendChild(document.createTextNode(' '));
    actions.appendChild(deleteBtn);
    row.appendChild(actions);

    courseTable.appendChild(row);
  });
}

searchInput.addEventListener('input', function () {
  const text = searchInput.value.toLowerCase();

  const filtered = allCourses.filter(function (course) {
    return (
      course.course_code.toLowerCase().includes(text) ||
      course.course_name.toLowerCase().includes(text)
    );
  });

  showCourses(filtered);
});

async function loadReport() {
  try {
    const response = await fetch(API_URL + '/courses/report');
    const data = await response.json();

    if (!response.ok) {
      reportMessage.textContent = data.message;
      reportMessage.className = 'message error';
      return;
    }

    reportTable.innerHTML = '';

    if (data.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 5;
      cell.textContent = 'No report data yet.';
      row.appendChild(cell);
      reportTable.appendChild(row);
      return;
    }

    data.forEach(function (item) {
      const row = document.createElement('tr');

      const values = [
        item.course_code,
        item.course_name,
        item.department_name,
        item.year_level_name,
        item.total_students
      ];

      values.forEach(function (value) {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
      });

      reportTable.appendChild(row);
    });
  } catch (error) {
    reportMessage.textContent = 'Cannot reach the server. Is the backend running?';
    reportMessage.className = 'message error';
  }
}

function openForm(course) {
  formMessage.className = 'message';
  courseForm.reset();

  if (course) {
    modalTitle.textContent = 'Edit course';
    courseIdInput.value = course.course_id;
    departmentInput.value = course.department_id;
    courseCodeInput.value = course.course_code;
    courseNameInput.value = course.course_name;
    descriptionInput.value = course.description || '';
  } else {
    modalTitle.textContent = 'Add course';
    courseIdInput.value = '';
  }

  overlay.classList.add('show');
}

function closeForm() {
  overlay.classList.remove('show');
}

document.getElementById('addBtn').addEventListener('click', function () {
  openForm(null);
});

document.getElementById('cancelBtn').addEventListener('click', closeForm);

courseForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const id = courseIdInput.value;
  const courseCode = courseCodeInput.value.trim();
  const courseName = courseNameInput.value.trim();

  if (departmentInput.value === '') {
    showFormError('Please choose a department.');
    return;
  }
  if (courseCode === '' || courseName === '') {
    showFormError('Course code and course name are required.');
    return;
  }

  const body = {
    department_id: departmentInput.value,
    course_code: courseCode,
    course_name: courseName,
    description: descriptionInput.value.trim()
  };

  let url = API_URL + '/courses';
  let method = 'POST';
  if (id !== '') {
    url = API_URL + '/courses/' + id;
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
      showFormError(data.message);
      return;
    }

    closeForm();
    showPageMessage(data.message, 'success');
    loadCourses();
    loadReport();
  } catch (error) {
    showFormError('Cannot reach the server. Is the backend running?');
  }
});

async function deleteCourse(course) {
  if (!confirm('Delete course "' + course.course_name + '"?')) {
    return;
  }

  try {
    const response = await fetch(API_URL + '/courses/' + course.course_id, {
      method: 'DELETE'
    });
    const data = await response.json();

    if (!response.ok) {
      showPageMessage(data.message, 'error');
      return;
    }

    showPageMessage(data.message, 'success');
    loadCourses();
    loadReport();
  } catch (error) {
    showPageMessage('Cannot reach the server. Is the backend running?', 'error');
  }
}

document.getElementById('logoutBtn').addEventListener('click', function () {
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
  window.location.href = 'login.html';
});

loadDepartments();
loadCourses();
loadReport();