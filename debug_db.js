import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'firewall.db'));
const settings = db.prepare('SELECT * FROM firewall_settings').all();
console.log('Settings:', settings);
const blocked = db.prepare('SELECT * FROM blocked_countries').all();
console.log('Blocked:', blocked);
