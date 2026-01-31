import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'firewall.db');
console.log('Using DB at:', dbPath);
const db = new Database(dbPath);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables);

if (tables.some(t => t.name === 'blocked_countries')) {
    const nl = db.prepare("SELECT 1 FROM blocked_countries WHERE country_code = 'NL'").get();
    console.log('NL blocked:', !!nl);
} else {
    console.log('blocked_countries table MISSION');
}

if (tables.some(t => t.name === 'firewall_settings')) {
    const settings = db.prepare("SELECT * FROM firewall_settings").all();
    console.log('Settings:', settings);
}
