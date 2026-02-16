import express from 'express';
import db from '../db/index.js';

const router = express.Router();

// Middleware to ensure only admins can manage logs
const requireAdmin = (req, res, next) => {
    // Basic PIN check for now due to simplistic auth
    const adminPin = req.headers['x-admin-pin'];
    if (String(adminPin) === '2323' || (req.session && req.session.isAdmin)) {
        return next();
    }
    res.status(403).json({ error: 'Unauthorized' });
};

// Get all logs with pagination/filtering
router.get('/logs', requireAdmin, (req, res) => {
    const { limit = 100, offset = 0 } = req.query;
    try {
        const logs = db.prepare('SELECT * FROM page_accesses ORDER BY timestamp DESC LIMIT ? OFFSET ?').all(limit, offset);
        const total = db.prepare('SELECT COUNT(*) as count FROM page_accesses').get().count;
        res.json({ logs, total });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Delete a specific log
router.delete('/:id', requireAdmin, (req, res) => {
    try {
        db.prepare('DELETE FROM page_accesses WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Clear all logs
router.delete('/', requireAdmin, (req, res) => {
    try {
        db.prepare('DELETE FROM page_accesses').run();
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get Stats for Dashboard
router.get('/stats', requireAdmin, (req, res) => {
    try {
        const result = db.prepare('SELECT * FROM page_accesses ORDER BY timestamp DESC LIMIT 1000').all();
        // Transform the Data to Match Frontend Expectations
        const formatted = result.map(row => ({
            ...row,
            country_code: row.countryCode,
            region_name: row.regionName || row.region,
            as_info: row.asName,
            screen_resolution: '' // Not stored in this schema version
        }));
        res.json(formatted);
    } catch (e) {
        console.error('Error fetching analytics stats:', e);
        res.status(500).json({ error: e.message });
    }
});

// Manual Tracking Endpoint (for client-side pushes)
router.post('/', async (req, res) => {
    // This functionality is largely covered by the middleware, but we'll accept extra metadata
    // The middleware already logs 'GET' requests.
    // If we want to capture client-side specifics (screen resolution etc), we'd need to update the log
    // For now, return success to simulate behavior without duplicating logs excessively
    res.json({ success: true });
});


// Get Threat Intelligence (Suspicious Traffic)
router.get('/threat-intel', requireAdmin, (req, res) => {
    try {
        const suspiciousIPs = db.prepare(`
            SELECT ip, country, isp, COUNT(*) as hit_count, 
                   MAX(proxy) as is_proxy, MAX(hosting) as is_hosting
            FROM page_accesses
            WHERE (proxy = 1 OR hosting = 1)
            GROUP BY ip
            ORDER BY hit_count DESC
            LIMIT 50
        `).all();

        const topBlocked = db.prepare(`
            SELECT countryCode, 'Locked' as countryName, 1 as status FROM blocked_countries
        `).all();

        res.json({ suspiciousIPs, topBlocked });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
