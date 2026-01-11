const { db } = require('../config/db');

const Video = {
    findAll: async ({ page = 1, limit = 12, category }) => {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM videos WHERE 1=1';
        const params = [];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const countResult = await db.execute({ sql: countQuery, args: params });
        const total = Number(countResult.rows[0].total);

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const result = await db.execute({ sql: query, args: params });

        return { data: result.rows, total, page, limit };
    },

    findById: async (id) => {
        const result = await db.execute({
            sql: 'SELECT * FROM videos WHERE id = ?',
            args: [id]
        });
        return result.rows[0];
    },

    create: async (video) => {
        const result = await db.execute({
            sql: `INSERT INTO videos (title, description, category, youtube_url, thumbnail_url, duration)
            VALUES (:title, :description, :category, :youtube_url, :thumbnail_url, :duration)`,
            args: {
                title: video.title,
                description: video.description,
                category: video.category,
                youtube_url: video.youtube_url,
                thumbnail_url: video.thumbnail_url,
                duration: video.duration
            }
        });
        // Convert BigInt to Number
        return { id: Number(result.lastInsertRowid), ...video };
    },

    update: async (id, updates) => {
        const keys = Object.keys(updates);
        if (keys.length === 0) return false;

        // LibSQL args object mapping
        const setClause = keys.map(k => `${k} = :${k}`).join(', ');
        const query = `UPDATE videos SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = :id`;

        // We must pass the id as part of the args object now
        const args = { ...updates, id };

        const result = await db.execute({
            sql: query,
            args: args
        });

        return result.rowsAffected > 0;
    },

    delete: async (id) => {
        const result = await db.execute({
            sql: 'DELETE FROM videos WHERE id = ?',
            args: [id]
        });
        return result.rowsAffected > 0;
    }
};

module.exports = Video;
