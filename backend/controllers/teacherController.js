const Teacher = require('../models/Teacher');

exports.createTeacher = (req, res) => {
    const {
        user_id, department_id, fname, lname,
        mname, email, specialization
    } = req.body;

    if (!user_id || !department_id) {
        return res.status(400).json({
            message: 'User and department are required.'
        });
    }

    Teacher.createTeacher({
        user_id,
        department_id,
        fname: fname || null,
        lname: lname || null,
        mname: mname || null,
        email: email || null,
        specialization: specialization || null
    }, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to create teacher.' });
        }

        res.status(201).json({
            message: 'Teacher created successfully.',
            teacher_id: result.insertId
        });
    });
};

exports.getAllTeachers = (req, res) => {
    Teacher.getAllTeachers((err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to retrieve teachers.' });
        }

        res.json(results);
    });
};

exports.getTeacherById = (req, res) => {
    Teacher.getTeacherById(req.params.id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to retrieve teacher.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        res.json(results[0]);
    });
};

exports.updateTeacher = (req, res) => {
    const {
        user_id, department_id, fname, lname,
        mname, email, specialization
    } = req.body;

    if (!user_id || !department_id) {
        return res.status(400).json({
            message: 'User and department are required.'
        });
    }

    Teacher.updateTeacher(req.params.id, {
        user_id,
        department_id,
        fname: fname || null,
        lname: lname || null,
        mname: mname || null,
        email: email || null,
        specialization: specialization || null
    }, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to update teacher.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Teacher not found or no changes made.' });
        }

        res.json({ message: 'Teacher updated successfully.' });
    });
};

exports.deleteTeacher = (req, res) => {
    Teacher.deleteTeacher(req.params.id, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to delete teacher.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        res.json({ message: 'Teacher deleted successfully.' });
    });
};