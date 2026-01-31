import Database from 'better-sqlite3';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'firewall.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS page_accesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT,
    country_code TEXT,
    country_name TEXT,
    region TEXT,
    city TEXT,
    lat REAL,
    lon REAL,
    isp TEXT,
    proxy INTEGER,
    hosting INTEGER,
    user_agent TEXT,
    path TEXT,
    is_blocked INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blocked_countries (
    country_code TEXT PRIMARY KEY,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS firewall_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  INSERT OR IGNORE INTO firewall_settings (key, value) VALUES ('lockdown_active', '0');
  INSERT OR IGNORE INTO firewall_settings (key, value) VALUES ('admin_ip', '127.0.0.1');
`);

const BOTS = [
    'Discordbot',
    'Twitterbot',
    'WhatsApp',
    'TelegramBot',
    'facebookexternalhit',
    'Googlebot',
    'Bingbot'
];

export const geoMiddleware = async (req, res, next) => {
    // Bypasses
    const ua = req.headers['user-agent'] || '';
    const isAdmin = req.headers['x-admin-auth'] === 'premium-admin'; // Example admin bypass
    const isBot = BOTS.some(bot => ua.includes(bot));

    // EMERGENCY BYPASS & ROBUSTNESS
    const isLocalhost = req.connection?.remoteAddress === '127.0.0.1' || req.connection?.remoteAddress === '::1';
    const hasSecretKey = req.query.bypass === process.env.FIREWALL_SECRET || req.headers['x-firewall-bypass'] === process.env.FIREWALL_SECRET;

    const lockdownSetting = db.prepare("SELECT value FROM firewall_settings WHERE key = 'lockdown_active'").get();
    const isLockdown = lockdownSetting && lockdownSetting.value === '1';

    // Get IP
    let ip = req.headers['cf-connecting-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        '127.0.0.1';

    if (ip.includes(',')) ip = ip.split(',')[0].trim();
    if (ip.includes('::ffff:')) ip = ip.split(':').pop();

    const adminIpSetting = db.prepare("SELECT value FROM firewall_settings WHERE key = 'admin_ip'").get();
    const isAdminIp = adminIpSetting && ip === adminIpSetting.value;

    // NEVER block these
    if (isAdmin || isBot || isAdminIp || isLocalhost || hasSecretKey) {
        return next();
    }

    // If Lockdown is active, and NOT admin/bot, block everyone
    if (isLockdown && req.path !== '/blocked') {
        return res.redirect('/blocked');
    }

    // If IP is local (development), we might want a mock IP for testing
    if (ip === '127.0.0.1' || ip === '::1') {
        // ip = '8.8.8.8'; // Uncomment for testing
    }

    try {
        // Check if we already have this IP data in page_accesses to avoid over-calling ip-api (optional caching)
        // For this implementation, we follow the "If unknown" logic
        let geoData = db.prepare('SELECT * FROM page_accesses WHERE ip = ? ORDER BY timestamp DESC LIMIT 1').get(ip);

        if (!geoData) {
            const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,lat,lon,isp,proxy,hosting,query`);
            const data = await response.json();

            if (data.status === 'success') {
                geoData = {
                    ip: data.query,
                    country_code: data.countryCode,
                    country_name: data.country,
                    region: data.regionName,
                    city: data.city,
                    lat: data.lat,
                    lon: data.lon,
                    isp: data.isp,
                    proxy: data.proxy ? 1 : 0,
                    hosting: data.hosting ? 1 : 0
                };
            }
        }

        if (geoData) {
            // Log access
            db.prepare(`
        INSERT INTO page_accesses (ip, country_code, country_name, region, city, lat, lon, isp, proxy, hosting, user_agent, path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
                ip,
                geoData.country_code,
                geoData.country_name,
                geoData.region,
                geoData.city,
                geoData.lat,
                geoData.lon,
                geoData.isp,
                geoData.proxy,
                geoData.hosting,
                ua,
                req.path,
                0 // is_blocked
            );

            // Check firewall
            const isBlocked = db.prepare('SELECT 1 FROM blocked_countries WHERE country_code = ?').get(geoData.country_code);

            if (isBlocked && req.path !== '/blocked') {
                // Update log to mark as blocked
                db.prepare('UPDATE page_accesses SET is_blocked = 1 WHERE id = (SELECT last_insert_rowid())').run();
                return res.redirect('/blocked');
            }

            // NL Logic
            if (geoData.country_code === 'NL') {
                req.isDutch = true;
                res.locals.injectLegalNotice = true;
            }
        }

        next();
    } catch (err) {
        console.error('GeoFirewall Error:', err);
        next(); // Don't block if API fails
    }
};

export const firewallApi = (app) => {
    app.post('/api/firewall/toggle', (req, res) => {
        const { countryCode } = req.body;
        if (!countryCode) return res.status(400).json({ error: 'Country code required' });

        const exists = db.prepare('SELECT 1 FROM blocked_countries WHERE country_code = ?').get(countryCode);

        if (exists) {
            db.prepare('DELETE FROM blocked_countries WHERE country_code = ?').run(countryCode);
            res.json({ success: true, action: 'removed', countryCode });
        } else {
            db.prepare('INSERT INTO blocked_countries (country_code) VALUES (?)').run(countryCode);
            res.json({ success: true, action: 'added', countryCode });
        }
    });

    app.get('/api/firewall/status', (req, res) => {
        const blocked = db.prepare('SELECT country_code FROM blocked_countries').all();
        const settings = db.prepare('SELECT * FROM firewall_settings').all();
        const stats = db.prepare(`
            SELECT country_code, COUNT(*) as count 
            FROM page_accesses 
            WHERE is_blocked = 1 
            GROUP BY country_code
        `).all();
        res.json({ blocked, settings, stats });
    });

    app.post('/api/firewall/bulk-toggle', (req, res) => {
        const { countryCodes, action } = req.body;
        if (!countryCodes || !Array.isArray(countryCodes)) return res.status(400).json({ error: 'Country codes array required' });

        const transaction = db.transaction((codes) => {
            for (const code of codes) {
                if (action === 'block') {
                    db.prepare('INSERT OR IGNORE INTO blocked_countries (country_code) VALUES (?)').run(code);
                } else {
                    db.prepare('DELETE FROM blocked_countries WHERE country_code = ?').run(code);
                }
            }
        });

        transaction(countryCodes);
        res.json({ success: true, count: countryCodes.length });
    });

    app.post('/api/firewall/lockdown', (req, res) => {
        const { active, adminIp } = req.body;
        if (active !== undefined) {
            db.prepare("UPDATE firewall_settings SET value = ? WHERE key = 'lockdown_active'").run(active ? '1' : '0');
        }
        if (adminIp) {
            db.prepare("UPDATE firewall_settings SET value = ? WHERE key = 'admin_ip'").run(adminIp);
        }
        res.json({ success: true });
    });
};
