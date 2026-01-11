require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { initDb } = require('./api/config/db');
const { seedDatabase } = require('./api/utils/seeder');

// Import Routes
const authRoutes = require('./api/routes/authRoutes');
const applicationRoutes = require('./api/routes/applicationRoutes');
const videoRoutes = require('./api/routes/videoRoutes');
const statsRoutes = require('./api/routes/statsRoutes');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/stats', statsRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'Football Academy API is running', env: process.env.NODE_ENV });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

const PORT = process.env.PORT || 4000;

// Startup Function
const startServer = async () => {
    try {
        await initDb();
        await seedDatabase();

        if (require.main === module) {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.error('Startup failed:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
