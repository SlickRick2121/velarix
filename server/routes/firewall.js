import express from 'express';
import db from '../db/index.js';

const router = express.Router();

// Admin Middleware
const adminOnly = (req, res, next) => {
    const adminPin = req.headers['x-admin-pin'];
    // Allow if session admin OR pin matches common default (for specific tools)
    if ((req.session && req.session.isAdmin) || String(adminPin) === '2323') return next();
    res.status(403).json({ success: false, error: 'Unauthorized' });
};

// POST /api/firewall/toggle: Add/remove a single country
router.post('/toggle', adminOnly, (req, res) => {
    const { countryCode } = req.body;
    if (!countryCode) return res.status(400).json({ success: false, error: 'Missing countryCode' });

    const code = countryCode.toUpperCase();
    try {
        const existing = db.prepare('SELECT 1 FROM blocked_countries WHERE countryCode = ?').get(code);
        if (existing) {
            db.prepare('DELETE FROM blocked_countries WHERE countryCode = ?').run(code);
            res.json({ success: true, action: 'removed', countryCode: code });
        } else {
            db.prepare('INSERT INTO blocked_countries (countryCode) VALUES (?)').run(code);
            res.json({ success: true, action: 'added', countryCode: code });
        }
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// POST /api/firewall/bulk-toggle: Perform batch blocking/unblocking
router.post('/bulk-toggle', adminOnly, (req, res) => {
    const { countries, action } = req.body; // action: 'block' or 'unblock'

    // Handle 'countryCodes' alias from frontend
    const codesToToggle = countries || req.body.countryCodes;

    if (!Array.isArray(codesToToggle)) return res.status(400).json({ success: false, error: 'Countries must be an array' });

    try {
        const transaction = db.transaction((codes) => {
            for (const code of codes) {
                const upperCode = code.toUpperCase();
                if (action === 'block') {
                    db.prepare('INSERT OR IGNORE INTO blocked_countries (countryCode) VALUES (?)').run(upperCode);
                } else if (action === 'unblock') {
                    db.prepare('DELETE FROM blocked_countries WHERE countryCode = ?').run(upperCode);
                }
            }
        });
        transaction(codesToToggle);
        res.json({ success: true, count: codesToToggle.length });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// GET /api/firewall/status: Return current blocklist, lockdown status, and blocked-attempt statistics
router.get('/status', (req, res) => {
    // Allow public read of status for the dashboard overlay, but sensitive control requires auth
    // For this route, we'll keep it open or check headers if needed. 
    // The frontend calls this frequently.
    try {
        const blocked = db.prepare('SELECT countryCode FROM blocked_countries').all();
        const settings = db.prepare('SELECT * FROM firewall_settings').all();

        // Transform for frontend expected format
        const blockedFormatted = blocked.map(r => ({ country_code: r.countryCode }));

        // Use raw settings array or map it
        const lockdownStatus = settings.find(s => s.key === 'lockdown_active')?.value === '1';

        const stats = db.prepare(`
            SELECT countryCode as country_code, COUNT(*) as count
            FROM page_accesses
            WHERE isBlocked = 1
            GROUP BY countryCode
        `).all();

        res.json({
            success: true,
            blocked: blockedFormatted,
            settings: settings,
            stats: stats
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// POST /api/firewall/lockdown: Update global lockdown and admin whitelist settings
router.post('/lockdown', adminOnly, (req, res) => {
    const { active, adminIp } = req.body; // Frontend sends 'active'

    try {
        if (active !== undefined) {
            db.prepare('INSERT OR REPLACE INTO firewall_settings (key, value) VALUES (?, ?)').run('lockdown_active', active ? '1' : '0');
        }
        if (req.body.europeBlock !== undefined) {
            db.prepare('INSERT OR REPLACE INTO firewall_settings (key, value) VALUES (?, ?)').run('europe_block', req.body.europeBlock ? '1' : '0');
        }
        if (req.body.usaBlock !== undefined) {
            db.prepare('INSERT OR REPLACE INTO firewall_settings (key, value) VALUES (?, ?)').run('usa_block', req.body.usaBlock ? '1' : '0');
        }
        if (adminIp !== undefined) {
            db.prepare('INSERT OR REPLACE INTO firewall_settings (key, value) VALUES (?, ?)').run('admin_ip', adminIp);
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

export default router;
