
import express from 'express';
import pg from 'pg';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(cors());
app.use(express.json());

// Initialize Database Schema
const initDb = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        status TEXT,
        country TEXT,
        country_code TEXT,
        region TEXT,
        region_name TEXT,
        city TEXT,
        zip TEXT,
        lat DECIMAL,
        lon DECIMAL,
        timezone TEXT,
        isp TEXT,
        org TEXT,
        as_info TEXT,
        query TEXT,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        user_agent TEXT,
        browser TEXT,
        os TEXT,
        device TEXT,
        language TEXT,
        screen_resolution TEXT,
        referrer TEXT,
        path TEXT
      );
    `);
        console.log('Database schema initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initDb();

// API Endpoints
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
        res.status(500).json({ status: 'error', database: err.message });
    }
});

app.post('/api/analytics', async (req, res) => {
    const v = req.body;
    console.log(`[Analytics] View tracked for path: ${v.path} from IP: ${v.query}`);

    try {
        await pool.query(
            `INSERT INTO analytics_events (
        status, country, country_code, region, region_name, city, zip, 
        lat, lon, timezone, isp, org, as_info, query, timestamp,
        user_agent, browser, os, device, language, screen_resolution, referrer, path
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)`,
            [
                v.status, v.country, v.countryCode, v.region, v.regionName, v.city, v.zip,
                v.lat, v.lon, v.timezone, v.isp, v.org, v.as, v.query, v.timestamp,
                v.userAgent, v.browser, v.os, v.device, v.language, v.screenResolution, v.referrer, v.path
            ]
        );
        res.status(201).json({ success: true });
    } catch (err) {
        console.error('[Analytics] Error saving to DB:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/analytics/stats', async (req, res) => {
    const adminPin = req.headers['x-admin-pin'];

    // Simple PIN check for protection (matching the frontend 2323)
    // In production, you should ideally use a long secure string in Railway Variables
    if (adminPin !== '2323') {
        return res.status(401).json({ error: 'Unauthorized: Admin Clearance Required' });
    }

    try {
        const result = await pool.query('SELECT * FROM analytics_events ORDER BY timestamp DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching analytics:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
