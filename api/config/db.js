const fs = require('fs');
const path = require('path');

const dbUrl = process.env.DATABASE_URL;
const isLibSQL = dbUrl && dbUrl.startsWith('libsql://');

let client;

if (isLibSQL) {
  // --- Cloud Driver (Turso) ---
  const { createClient } = require('@libsql/client');
  const authToken = process.env.TURSO_AUTH_TOKEN;

  const cloudClient = createClient({
    url: dbUrl,
    authToken: authToken
  });

  client = {
    execute: async (stmt) => {
      // Normalize args: LibSQL expects {sql, args} or (sql, args)
      // Our models pass { sql, args } object. LibSQL client supports this directly.
      return await cloudClient.execute(stmt);
    }
  };
  console.log('📡 Using Cloud Database (LibSQL)');
} else {
  // --- Local/File Driver (better-sqlite3) ---
  const Database = require('better-sqlite3');

  // Use /tmp for Vercel, or local database folder for dev
  const isVercel = process.env.VERCEL === '1';
  const dbPath = isVercel
    ? '/tmp/academy.db'
    : path.join(__dirname, '../../database/academy.db');

  // Ensure directory exists (only for local dev, /tmp always exists)
  if (!isVercel) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  const localDb = new Database(dbPath);

  // Normalize execute to match LibSQL signature (Async shim)
  client = {
    execute: async (stmt) => {
      // stmt is { sql, args }
      // better-sqlite3 uses prepare(sql).run(args) or .all(args)
      // We need to guess if it's a read or write, or just use run/all based on SQL?
      // Actually, better-sqlite3 requires explicit .run() or .all()

      const sql = stmt.sql.trim();
      const isSelect = sql.toUpperCase().startsWith('SELECT');
      const prepared = localDb.prepare(stmt.sql);

      // better-sqlite3 expects args as array or object, but NOT inside an 'args' wrapper property if passing separately
      // BUT our code passes { sql, args } to this wrapper.
      const args = stmt.args || [];

      if (isSelect) {
        const rows = prepared.all(args);
        return { rows, rowsAffected: 0, lastInsertRowid: 0 }; // Mock response format
      } else {
        const info = prepared.run(args);
        return {
          rows: [],
          rowsAffected: info.changes,
          lastInsertRowid: info.lastInsertRowid // native BigInt or number support
        };
      }
    }
  };
  console.log(`📂 Using Local Database: ${dbPath}`);
}

const initDb = async () => {
  try {
    // Schema resolution
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.warn(`⚠️ Schema file not found at: ${schemaPath}`);
      return;
    }
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);

    for (const statement of statements) {
      await client.execute({ sql: statement });
    }

    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database init failed:', error);
    throw error; // Re-throw to show in vercel logs
  }
};

module.exports = {
  db: client,
  initDb
};
