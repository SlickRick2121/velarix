
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

const getBrowserName = (ua) => {
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    if (ua.includes('Trident')) return 'Internet Explorer';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    return 'Unknown';
};

const getOSName = (ua) => {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    if (ua.includes('Macintosh')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    return 'Unknown';
};

// API Endpoints
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected', time: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ status: 'error', database: err.message });
    }
});

app.post('/api/analytics', async (req, res) => {
    const v = req.body;
    let originalIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    let ip = originalIp;

    // Clean up proxy addresses
    if (typeof ip === 'string') {
        if (ip.includes(',')) ip = ip.split(',')[0].trim();
        if (ip.includes('::ffff:')) ip = ip.split(':').pop();
    }

    const ua = req.headers['user-agent'] || '';

    try {
        console.log(`[Analytics] Attempting track for IP: ${ip} | Path: ${v.path}`);

        // Fetch Geo Data from Backend to avoid client-side blocks
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const geo = await geoRes.json();

        const timestamp = new Date().toISOString();

        await pool.query(
            `INSERT INTO analytics_events (
        status, country, country_code, region, region_name, city, zip, 
        lat, lon, timezone, isp, org, as_info, query, timestamp,
        user_agent, browser, os, device, language, screen_resolution, referrer, path
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)`,
            [
                'success', geo.country_name || 'Unknown', geo.country_code || '??',
                geo.region_code || '', geo.region || '', geo.city || 'Unknown', geo.postal || '',
                geo.latitude || 0, geo.longitude || 0, geo.timezone || '',
                geo.org || 'Unknown', geo.org || 'Unknown', geo.asn || '', ip.toString(), timestamp,
                ua, getBrowserName(ua), getOSName(ua), v.device || 'Desktop', v.language || '',
                v.screenResolution || '', v.referrer || '', v.path
            ]
        );
        console.log(`[Analytics] Tracked SUCCESS for ${v.path}`);
        res.status(201).json({ success: true });
    } catch (err) {
        console.error('[Analytics] Error saving:', err.message);
        // Fallback save with minimal data if Geo API fails
        try {
            await pool.query(`INSERT INTO analytics_events (query, path, user_agent, timestamp) VALUES ($1, $2, $3, $4)`,
                [ip.toString(), v.path, ua, new Date().toISOString()]);
            console.log(`[Analytics] Tracked (FALLBACK) for ${v.path}`);
        } catch (e) {
            console.error('[Analytics] Critical fallback failure:', e.message);
        }
        res.status(201).json({ success: true }); // Still return success to client
    }
});

app.get('/api/analytics/stats', async (req, res) => {
    const adminPin = req.headers['x-admin-pin'];

    if (String(adminPin) !== '2323') {
        console.warn(`[Security] Unauthorized access attempt with PIN: ${adminPin}`);
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const result = await pool.query('SELECT * FROM analytics_events ORDER BY timestamp DESC LIMIT 1000');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching analytics:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port} | Full-Stack Tracking Ready`);
});
