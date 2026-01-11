const { db } = require('../config/db');

const User = {
    findByEmail: async (email) => {
        const result = await db.execute({
            sql: 'SELECT * FROM admin_users WHERE email = ?',
            args: [email]
        });
        return result.rows[0];
    },

    findById: async (id) => {
        const result = await db.execute({
            sql: 'SELECT * FROM admin_users WHERE id = ?',
            args: [id]
        });
        return result.rows[0];
    },

    create: async (user) => {
        const result = await db.execute({
            sql: `INSERT INTO admin_users (email, password_hash, full_name, role)
            VALUES (:email, :password_hash, :full_name, :role)`,
            args: {
                email: user.email,
                password_hash: user.password_hash,
                full_name: user.full_name,
                role: user.role
            }
        });
        // LibSQL returns lastInsertRowid as 'lastInsertRowid'
        return { id: result.lastInsertRowid, ...user };
    },

    updateLastLogin: async (id) => {
        await db.execute({
            sql: 'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            args: [id]
        });
    }
};

module.exports = User;
