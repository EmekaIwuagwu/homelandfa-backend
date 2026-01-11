const { db } = require('../config/db');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
    try {
        console.log('🌱 Checking Database Seed...');

        // 1. Ensure Super Admin Exists
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@homelandfa.com';
        const adminPassword = 'password123';

        const adminResult = await db.execute({
            sql: 'SELECT * FROM admin_users WHERE email = ?',
            args: [adminEmail]
        });

        if (adminResult.rows.length === 0) {
            console.log('👤 Creating Super Admin...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            await db.execute({
                sql: `INSERT INTO admin_users (email, password_hash, full_name, role)
              VALUES (?, ?, ?, ?)`,
                args: [adminEmail, hashedPassword, 'System Admin', 'super_admin']
            });

            console.log(`✅ Super Admin created: ${adminEmail} / ${adminPassword}`);
        }

        // 2. Ensure Sample Videos Exist
        const videoResult = await db.execute('SELECT COUNT(*) as count FROM videos');
        const videoCount = Number(videoResult.rows[0].count);

        if (videoCount === 0) {
            console.log('📹 Adding sample videos...');
            await db.execute({
                sql: `INSERT INTO videos (title, description, category, youtube_url, duration)
              VALUES (?, ?, ?, ?, ?)`,
                args: ['Ball Control Drills', 'Essential ball control techniques.', 'Training', 'https://www.youtube.com/watch?v=example1', 600]
            });

            await db.execute({
                sql: `INSERT INTO videos (title, description, category, youtube_url, duration)
              VALUES (?, ?, ?, ?, ?)`,
                args: ['Academy Highlights 2024', 'Best moments from the last season.', 'Highlights', 'https://www.youtube.com/watch?v=example2', 180]
            });
            console.log('✅ Sample videos added.');
        }

        console.log('✨ Database Seed Check Complete.');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        // Don't kill the process, just log error
    }
};

module.exports = { seedDatabase };
