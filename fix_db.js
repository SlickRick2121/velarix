import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, 'firewall.db'));

try {
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
    console.log('Tables created successfully');
} catch (e) {
    console.error('Error creating tables:', e.message);
}
