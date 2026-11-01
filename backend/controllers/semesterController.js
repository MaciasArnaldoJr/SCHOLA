const Semester = require('../models/Semester');

exports.createSemester = (req, res) => {
    const {
        semester_name, academic_year, start_date, end_date, status
    } = req.body;

    if (!semester_name || !academic_year) {
        return res.status(400).json({
            message: 'Semester name and academic year are required.'
        });
    }

    Semester.createSemester({
        semester_name,
        academic_year,
        start_date: start_date || null,
        end_date: end_date || null,
        status: status || null
    }, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to create semester.'
            });
        }

        res.status(201).json({
            message: 'Semester created successfully.',
            semester_id: result.insertId
        });
    });
};

exports.getAllSemesters = (req, res) => {
    Semester.getAllSemesters((err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to retrieve semesters.'
            });
        }

        res.json(results);
    });
};

exports.getSemesterById = (req, res) => {
    Semester.getSemesterById(req.params.id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to retrieve semester.'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Semester not found.'
            });
        }

        res.json(results[0]);
    });
};

exports.updateSemester = (req, res) => {
    const {
        semester_name, academic_year, start_date, end_date, status
    } = req.body;

    if (!semester_name || !academic_year) {
        return res.status(400).json({
            message: 'Semester name and academic year are required.'
        });
    }

    Semester.updateSemester(req.params.id, {
        semester_name,
        academic_year,
        start_date: start_date || null,
        end_date: end_date || null,
        status: status || null
    }, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to update semester.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Semester not found or no changes made.'
            });
        }

        res.json({
            message: 'Semester updated successfully.'
        });
    });
};

exports.deleteSemester = (req, res) => {
    Semester.deleteSemester(req.params.id, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to delete semester.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Semester not found.'
            });
        }

        res.json({
            message: 'Semester deleted successfully.'
        });
    });
};