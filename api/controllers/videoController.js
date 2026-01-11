const Video = require('../models/videoModel');

const getAllVideos = async (req, res) => {
    try {
        const { page, limit, category } = req.query;
        const result = await Video.findAll({ page: parseInt(page) || 1, limit: parseInt(limit) || 12, category });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ error: 'Video not found' });
        res.json({ video });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const createVideo = async (req, res) => {
    try {
        const { title, description, category, youtube_url, thumbnail_url, duration } = req.body;
        const videoData = {
            title,
            description: description || '',
            category,
            youtube_url,
            thumbnail_url: thumbnail_url || '',
            duration: duration || 0
        };
        const newVideo = await Video.create(videoData);
        res.status(201).json({ video: newVideo });
    } catch (error) {
        console.error('Create Video Error:', error);
        res.status(500).json({ error: 'Failed to create video' });
    }
};

const updateVideo = async (req, res) => {
    try {
        const success = await Video.update(req.params.id, req.body);
        if (!success) return res.status(404).json({ error: 'Video not found or no changes made' });

        const updatedVideo = await Video.findById(req.params.id);
        res.json({ message: 'Video updated', video: updatedVideo });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const success = await Video.delete(req.params.id);
        if (!success) return res.status(404).json({ error: 'Video not found' });
        res.json({ message: 'Video deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getAllVideos, getVideoById, createVideo, updateVideo, deleteVideo };
