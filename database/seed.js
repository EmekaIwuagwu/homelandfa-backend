const { seedDatabase } = require('../api/utils/seeder');
const { initDb } = require('../api/config/db');
require('dotenv').config();

const run = async () => {
    await initDb();
    await seedDatabase();
};

run();
