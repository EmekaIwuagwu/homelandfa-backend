const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

// Fallback to /tmp for Vercel if cloud DB is not set
const dbUrl = process.env.DATABASE_URL || 'file:/tmp/academy.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: dbUrl,
  authToken: authToken
});

const initDb = async () => {
  try {
    // Check if we are using a local file and if it needsschema
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements because execute() runs one at a time
    // This is a simple split by semi-colon, might fail on complex triggers but works for simple schemas
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await client.execute(statement);
    }

    console.log('✅ Database connected and initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
};

module.exports = {
  db: client,
  initDb
};
