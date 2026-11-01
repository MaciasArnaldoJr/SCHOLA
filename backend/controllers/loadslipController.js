const Loadslip = require('../models/Loadslip');

exports.createLoadslip = (req, res) => {
    const {
        student_id, subject_id, teacher_id, semester_id,
        year_level_id, course_id, school_year, section,
        enrollment_status, date_enrolled
    } = req.body;

    if (!student_id || !subject_id || !teacher_id || !semester_id ||
        !year_level_id || !course_id) {
        return res.status(400).json({
            message: 'Student, subject, teacher, semester, year level, and course are required.'
        });
    }

    Loadslip.createLoadslip({
        student_id,
        subject_id,
        teacher_id,
        semester_id,
        year_level_id,
        course_id,
        school_year: school_year || null,
        section: section || null,
        enrollment_status: enrollment_status || null,
        date_enrolled: date_enrolled || null
    }, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to create loadslip.'
            });
        }

        res.status(201).json({
            message: 'Loadslip created successfully.',
            loadslip_id: result.insertId
        });
    });
};

exports.getAllLoadslips = (req, res) => {
    Loadslip.getAllLoadslips((err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to retrieve loadslips.'
            });
        }

        res.json(results);
    });
};

exports.getLoadslipById = (req, res) => {
    Loadslip.getLoadslipById(req.params.id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to retrieve loadslip.'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Loadslip not found.'
            });
        }

        res.json(results[0]);
    });
};

exports.updateLoadslip = (req, res) => {
    const {
        student_id, subject_id, teacher_id, semester_id,
        year_level_id, course_id, school_year, section,
        enrollment_status, date_enrolled
    } = req.body;

    if (!student_id || !subject_id || !teacher_id || !semester_id ||
        !year_level_id || !course_id) {
        return res.status(400).json({
            message: 'Student, subject, teacher, semester, year level, and course are required.'
        });
    }

    Loadslip.updateLoadslip(req.params.id, {
        student_id,
        subject_id,
        teacher_id,
        semester_id,
        year_level_id,
        course_id,
        school_year: school_year || null,
        section: section || null,
        enrollment_status: enrollment_status || null,
        date_enrolled: date_enrolled || null
    }, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to update loadslip.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Loadslip not found or no changes made.'
            });
        }

        res.json({
            message: 'Loadslip updated successfully.'
        });
    });
};

exports.deleteLoadslip = (req, res) => {
    Loadslip.deleteLoadslip(req.params.id, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to delete loadslip.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Loadslip not found.'
            });
        }

        res.json({
            message: 'Loadslip deleted successfully.'
        });
    });
};