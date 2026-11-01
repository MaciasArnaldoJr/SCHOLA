const Subject = require('../models/Subject');

exports.createSubject = (req, res) => {
    const {
        department_id, subject_code, subject_name, description, units
    } = req.body;

    if (!department_id || !subject_code || !subject_name || !units) {
        return res.status(400).json({
            message: 'Department, subject code, subject name, and units are required.'
        });
    }

    Subject.createSubject({
        department_id,
        subject_code,
        subject_name,
        description: description || null,
        units
    }, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to create subject.'
            });
        }

        res.status(201).json({
            message: 'Subject created successfully.',
            subject_id: result.insertId
        });
    });
};

exports.getAllSubjects = (req, res) => {
    Subject.getAllSubjects((err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to retrieve subjects.'
            });
        }

        res.json(results);
    });
};

exports.getSubjectById = (req, res) => {
    Subject.getSubjectById(req.params.id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to retrieve subject.'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Subject not found.'
            });
        }

        res.json(results[0]);
    });
};

exports.updateSubject = (req, res) => {
    const {
        department_id, subject_code, subject_name, description, units
    } = req.body;

    if (!department_id || !subject_code || !subject_name || !units) {
        return res.status(400).json({
            message: 'Department, subject code, subject name, and units are required.'
        });
    }

    Subject.updateSubject(req.params.id, {
        department_id,
        subject_code,
        subject_name,
        description: description || null,
        units
    }, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to update subject.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Subject not found or no changes made.'
            });
        }

        res.json({
            message: 'Subject updated successfully.'
        });
    });
};

exports.deleteSubject = (req, res) => {
    Subject.deleteSubject(req.params.id, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to delete subject.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Subject not found.'
            });
        }

        res.json({
            message: 'Subject deleted successfully.'
        });
    });
};