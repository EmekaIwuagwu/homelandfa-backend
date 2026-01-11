const Application = require('../models/applicationModel');

const getOverview = async (req, res) => {
    try {
        const stats = await Application.getOverviewStats();
        res.json(stats);
    } catch (error) {
        console.error('Stats Overview Error:', error);
        res.status(500).json({ error: 'Server error fetching overview stats' });
    }
};

const getApplicationsByProgram = async (req, res) => {
    try {
        const stats = await Application.getByProgramStats();
        res.json(stats);
    } catch (error) {
        console.error('Stats Program Error:', error);
        res.status(500).json({ error: 'Server error fetching program stats' });
    }
};

const getMonthlyTrend = async (req, res) => {
    try {
        const stats = await Application.getMonthlyStats();
        res.json(stats);
    } catch (error) {
        console.error('Stats Monthly Error:', error);
        res.status(500).json({ error: 'Server error fetching monthly stats' });
    }
};

const getAgeDistribution = async (req, res) => {
    try {
        const stats = await Application.getAgeDistribution();
        res.json(stats);
    } catch (error) {
        console.error('Stats Age Error:', error);
        res.status(500).json({ error: 'Server error fetching age stats' });
    }
};

module.exports = {
    getOverview,
    getApplicationsByProgram,
    getMonthlyTrend,
    getAgeDistribution
};
