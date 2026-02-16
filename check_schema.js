import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, 'firewall.db'));

const info = db.prepare(`PRAGMA table_info(page_accesses)`).all();
console.log(info.map(c => c.name));
