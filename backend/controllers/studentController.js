const Student = require('../models/Student');

exports.createStudent = (req, res) => {
    const {
        user_id, course_id, department_id, year_level_id,
        fname, lname, mname, section, birth_date
    } = req.body;

    if (!user_id || !course_id || !department_id || !year_level_id) {
        return res.status(400).json({
            message: 'User, course, department, and year level are required.'
        });
    }

    Student.createStudent({
        user_id,
        course_id,
        department_id,
        year_level_id,
        fname: fname || null,
        lname: lname || null,
        mname: mname || null,
        section: section || null,
        birth_date: birth_date || null
    }, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to create student.' });
        }

        res.status(201).json({
            message: 'Student created successfully.',
            student_id: result.insertId
        });
    });
};

exports.getAllStudents = (req, res) => {
    Student.getAllStudents((err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to retrieve students.' });
        }

        res.json(results);
    });
};

exports.getStudentById = (req, res) => {
    Student.getStudentById(req.params.id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to retrieve student.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        res.json(results[0]);
    });
};

exports.updateStudent = (req, res) => {
    const {
        user_id, course_id, department_id, year_level_id,
        fname, lname, mname, section, birth_date
    } = req.body;

    if (!user_id || !course_id || !department_id || !year_level_id) {
        return res.status(400).json({
            message: 'User, course, department, and year level are required.'
        });
    }

    Student.updateStudent(req.params.id, {
        user_id,
        course_id,
        department_id,
        year_level_id,
        fname: fname || null,
        lname: lname || null,
        mname: mname || null,
        section: section || null,
        birth_date: birth_date || null
    }, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to update student.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found or no changes made.' });
        }

        res.json({ message: 'Student updated successfully.' });
    });
};

exports.deleteStudent = (req, res) => {
    Student.deleteStudent(req.params.id, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to delete student.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        res.json({ message: 'Student deleted successfully.' });
    });
};