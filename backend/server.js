const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.static(path.join(__dirname, '..', 'frontend')));

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const courseRoutes = require('./routes/courseRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const yearlevelRoutes = require('./routes/yearlevelRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const semesterRoutes = require('./routes/semesterRoutes');
const loadslipRoutes = require('./routes/loadslipRoutes');
const activityRoutes = require('./routes/activityRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const roomRoutes = require('./routes/roomRoutes');
const learningMaterialRoutes = require('./routes/learningMaterialRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/yearlevels', yearlevelRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/loadslips', loadslipRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/learningmaterials', learningMaterialRoutes);

app.get('/api', (req, res) => {
  res.json({
    project: 'SCHOLA',
    status: 'Running'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});