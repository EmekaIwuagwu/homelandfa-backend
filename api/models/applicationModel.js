const { db } = require('../config/db');

const Application = {
  findAll: async ({ page = 1, limit = 20, status, program, search }) => {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM applications WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (program) {
      query += ' AND preferred_program = ?';
      params.push(program);
    }
    if (search) {
      query += ' AND (player_name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    // Get Total Count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await db.execute({ sql: countQuery, args: params });
    const total = Number(countResult.rows[0].total);

    // Get Data
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await db.execute({ sql: query, args: params });

    return { data: result.rows, total, page, limit };
  },

  findById: async (id) => {
    const result = await db.execute({
      sql: 'SELECT * FROM applications WHERE id = ?',
      args: [id]
    });
    return result.rows[0];
  },

  create: async (application) => {
    const keys = Object.keys(application);
    const columns = keys.join(', ');
    const placeholders = keys.map(k => `:${k}`).join(', ');

    const result = await db.execute({
      sql: `INSERT INTO applications (${columns}) VALUES (${placeholders})`,
      args: application
    });

    // LibSQL returns lastInsertRowid as BigInt, convert to Number for JSON safety
    const id = Number(result.lastInsertRowid);
    return { id, ...application };
  },

  updateStatus: async (id, status) => {
    const result = await db.execute({
      sql: 'UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [status, id]
    });
    return result.rowsAffected > 0;
  },

  getOverviewStats: async () => {
    const total = await db.execute('SELECT COUNT(*) as count FROM applications');
    const enrolled = await db.execute("SELECT COUNT(*) as count FROM applications WHERE status = 'enrolled'");
    const pending = await db.execute("SELECT COUNT(*) as count FROM applications WHERE status = 'pending'");
    const videos = await db.execute('SELECT COUNT(*) as count FROM videos');
    const recent = await db.execute('SELECT * FROM applications ORDER BY created_at DESC LIMIT 5');

    return {
      totalApplications: Number(total.rows[0].count),
      enrolled: Number(enrolled.rows[0].count),
      pending: Number(pending.rows[0].count),
      videos: Number(videos.rows[0].count),
      recentApplications: recent.rows
    };
  },

  getByProgramStats: async () => {
    const result = await db.execute(`
      SELECT preferred_program as program, COUNT(*) as count
      FROM applications 
      GROUP BY preferred_program
    `);

    // Calculate percentage manually since SQL division can be tricky
    const total = result.rows.reduce((sum, row) => sum + Number(row.count), 0);
    return result.rows.map(row => ({
      ...row,
      percentage: total > 0 ? (Number(row.count) * 100 / total) : 0
    }));
  },

  getMonthlyStats: async () => {
    const result = await db.execute(`
      SELECT strftime('%Y-%m', created_at) as month, 
      COUNT(*) as applications,
      SUM(CASE WHEN status = 'enrolled' THEN 1 ELSE 0 END) as enrollments
      FROM applications 
      GROUP BY month 
      ORDER BY month DESC 
      LIMIT 12
    `);
    return result.rows;
  },

  getAgeDistribution: async () => {
    const result = await db.execute(`
      SELECT 
        CASE 
          WHEN (strftime('%Y', 'now') - strftime('%Y', date_of_birth)) < 10 THEN 'Under 10'
          WHEN (strftime('%Y', 'now') - strftime('%Y', date_of_birth)) BETWEEN 10 AND 12 THEN '10-12'
          WHEN (strftime('%Y', 'now') - strftime('%Y', date_of_birth)) BETWEEN 13 AND 15 THEN '13-15'
          WHEN (strftime('%Y', 'now') - strftime('%Y', date_of_birth)) BETWEEN 16 AND 18 THEN '16-18'
          ELSE 'Over 18'
        END as ageGroup,
        COUNT(*) as count
      FROM applications
      GROUP BY ageGroup
    `);
    return result.rows;
  }
};

module.exports = Application;
