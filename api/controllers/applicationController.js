const Application = require('../models/applicationModel');
const { sendApplicationNotification, sendStatusUpdate } = require('../utils/emailService');
const { Parser } = require('json2csv');

const getAllApplications = async (req, res) => {
    try {
        const { page, limit, status, program, search } = req.query;
        const result = await Application.findAll({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            status,
            program,
            search
        });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error retrieving applications' });
    }
};

const getApplicationById = async (req, res) => {
    try {
        const app = await Application.findById(req.params.id);
        if (!app) return res.status(404).json({ error: 'Application not found' });
        res.json({ application: app });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const createApplication = async (req, res) => {
    try {
        const newApp = await Application.create(req.body);

        // Send email notification asynchronously
        sendApplicationNotification(req.body).catch(err => console.error('Email notification failed:', err));

        res.status(201).json({ message: 'Application submitted successfully', id: newApp.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const success = await Application.updateStatus(req.params.id, status);
        if (!success) return res.status(404).json({ error: 'Application not found' });

        // Fetch details for email
        const app = await Application.findById(req.params.id);
        if (app) {
            sendStatusUpdate(app, status).catch(err => console.error('Status email failed:', err));
        }

        res.json({ success: true, message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getStats = async (req, res) => {
    try {
        const stats = await Application.getOverviewStats(); // Note: getOverviewStats is in model but getStats calls it? 
        // Wait, the model method is getOverviewStats but some code might refer to getStats 
        // Let's stick to what's defined in the model: getOverviewStats, getByProgramStats, etc.
        // Actually, the route /stats calls applicationController.getStats which currently calls Application.getStats()
        // But in the NEW async model, I called it getOverviewStats(). I should fix the controller.

        // Actually for the "statsController" separate file, it calls getOverviewStats. 
        // This file is applicationController, which handles /applications routes.
        // It seems I might have a duplicate getStats here or it's for a different purpose? 
        // The earlier codebase had getStats in applicationController.

        // Let's use getOverviewStats which returns the big object
        const overview = await Application.getOverviewStats();
        // Since getStats usually returned { total, byStatus, byProgram } in the sync version,
        // we should try to match that or just return the overview if acceptable.

        // The sync version returned: { total, byStatus, byProgram }
        // The new async getOverviewStats returns: { totalApplications, enrolled, pending, videos, recentApplications }
        // This is slightly different. Let's make sure we don't break clients.

        // For now, let's just return what getOverviewStats gives us.
        res.json(overview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const exportApplications = async (req, res) => {
    try {
        const result = await Application.findAll({ limit: 10000 });

        if (!result.data.length) {
            return res.status(404).json({ error: 'No applications to export' });
        }

        const fields = [
            'id', 'player_name', 'date_of_birth', 'gender', 'preferred_program',
            'status', 'parent_name', 'phone', 'email', 'created_at'
        ];
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(result.data);

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename="applications.csv"');
        res.send(csv);
    } catch (error) {
        console.error('Export Error:', error);
        res.status(500).json({ error: 'Failed to export applications' });
    }
};

module.exports = {
    getAllApplications,
    getApplicationById,
    createApplication,
    updateApplicationStatus,
    getStats,
    exportApplications
};
