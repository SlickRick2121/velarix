import Database from 'better-sqlite3';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'firewall.db'));

// Initialize tables and handle migrations
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

// Migration: Add is_blocked if missing
try {
    db.prepare("ALTER TABLE page_accesses ADD COLUMN is_blocked INTEGER DEFAULT 0").run();
    console.log("[Firewall] Migration: Added is_blocked column to page_accesses");
} catch (e) {
    // Column already exists
}

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
    const isAdminHeader = req.headers['x-admin-auth'] === 'premium-admin';
    const isBot = BOTS.some(bot => ua.includes(bot));

    // Get IP
    let ip = req.headers['cf-connecting-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        '127.0.0.1';

    if (ip.includes(',')) ip = ip.split(',')[0].trim();
    if (ip.includes('::ffff:')) ip = ip.split(':').pop();

    const isLocalhost = ip === '127.0.0.1' || ip === '::1';
    const hasSecretKey = req.query.bypass === process.env.FIREWALL_SECRET || req.headers['x-firewall-bypass'] === process.env.FIREWALL_SECRET;

    const lockdownSetting = db.prepare("SELECT value FROM firewall_settings WHERE key = 'lockdown_active'").get();
    const isLockdown = lockdownSetting && lockdownSetting.value === '1';

    const adminIpSetting = db.prepare("SELECT value FROM firewall_settings WHERE key = 'admin_ip'").get();
    const isAdminIp = adminIpSetting && ip === adminIpSetting.value;

    // LOGGING BYPASSES (Crucial for debugging)
    const shouldBypass = isAdminHeader || isBot || isAdminIp || isLocalhost || hasSecretKey;

    if (shouldBypass) {
        if (!isLocalhost || req.path.startsWith('/api')) {
            console.log(`[Firewall Bypass] IP: ${ip} | Reason: ${isAdminHeader ? 'Header' : isBot ? 'Bot' : isAdminIp ? 'AdminIP' : hasSecretKey ? 'SecretKey' : 'Localhost'}`);
        }
        return next();
    }

    // If Lockdown is active, and NOT bypassed
    if (isLockdown && req.path !== '/blocked') {
        console.log(`[Firewall Lockdown] Blocking ${ip}`);
        return res.redirect('/blocked');
    }

    try {
        let geoData = db.prepare('SELECT * FROM page_accesses WHERE ip = ? ORDER BY timestamp DESC LIMIT 1').get(ip);

        if (!geoData) {
            console.log(`[Firewall] Fetching GeoIP for ${ip}...`);
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();

            if (!data.error) {
                geoData = {
                    ip: data.ip,
                    country_code: data.country_code,
                    country_name: data.country_name,
                    region: data.region,
                    city: data.city,
                    lat: data.latitude,
                    lon: data.longitude,
                    isp: data.org,
                    proxy: 0,
                    hosting: 0
                };
                console.log(`[Firewall] GeoIP detected: ${geoData.country_code}`);
            } else {
                console.warn(`[Firewall] GeoIP fetch failed for ${ip}: ${data.reason}`);
            }
        }

        if (geoData) {
            console.log(`[Firewall Audit] IP: ${ip} | Country: ${geoData.country_code} | Path: ${req.path}`);

            // Check firewall
            const blockedRow = db.prepare('SELECT COUNT(*) as count FROM blocked_countries WHERE country_code = ?').get(geoData.country_code);
            const isBlocked = blockedRow.count > 0;

            console.log(`[Firewall Audit] Block Check for ${geoData.country_code}: ${isBlocked ? 'BLOCKED' : 'ALLOWED'}`);

            if (isBlocked && req.path !== '/blocked') {
                console.log(`[Firewall Audit] REDIRECTING ${ip} to /blocked`);

                // Log as blocked attempt
                try {
                    db.prepare(`
                        INSERT INTO page_accesses (ip, country_code, country_name, region, city, lat, lon, isp, proxy, hosting, user_agent, path, is_blocked)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                    `).run(ip, geoData.country_code, geoData.country_name, geoData.region, geoData.city, geoData.lat, geoData.lon, geoData.isp, geoData.proxy, geoData.hosting, ua, req.path);
                } catch (e) {
                    console.error("[Firewall Audit] Log failure:", e.message);
                }

                return res.redirect('/blocked');
            }

            // Log successful access
            try {
                db.prepare(`
                    INSERT INTO page_accesses (ip, country_code, country_name, region, city, lat, lon, isp, proxy, hosting, user_agent, path, is_blocked)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
                `).run(ip, geoData.country_code, geoData.country_name, geoData.region, geoData.city, geoData.lat, geoData.lon, geoData.isp, geoData.proxy, geoData.hosting, ua, req.path);
            } catch (e) {
                // Ignore log errors to avoid blocking user access
            }

            // NL Logic
            if (geoData.country_code === 'NL') {
                console.log("[Firewall Audit] NL User Detected - Activating Legal Notice");
                req.isDutch = true;
                res.locals.injectLegalNotice = true;
            }
        }

        next();
    } catch (err) {
        console.error('[Firewall Error]', err.message);
        next();
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
