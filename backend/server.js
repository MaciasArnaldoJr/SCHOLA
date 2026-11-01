require('dotenv').config();

const express = require('express');

const app = express();

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const courseRoutes = require('./routes/courseRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const yearLevelRoutes = require('./routes/yearLevelRoutes');

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

app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);

app.use('/api/courses', courseRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/yearlevels', yearLevelRoutes);

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

app.get('/', (req, res) => {
    res.json({
        project: 'SCHOLA',
        status: 'Running'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});