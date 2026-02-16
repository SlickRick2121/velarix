import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import New Middleware & Routes
import { geoMiddleware } from './server/middleware/geoFirewall.js';
import analyticsRouter from './server/routes/analytics.js';
import firewallRouter from './server/routes/firewall.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Basic Middleware
app.use(cors());
app.use(express.json());

// 1. Geo-Firewall Middleware (Runs before everything else)
app.use(geoMiddleware);

// 2. API Routes
app.use('/api/analytics', analyticsRouter);
app.use('/api/firewall', firewallRouter);

// 3. Status Page Heartbeat API
app.get('/api/heartbeat-data', (req, res) => {
    // Simulate system checks or hook into real DB/CPU stats if needed
    // For now, mirroring the reference implementation
    const components = [
        {
            name: 'Main Website',
            type: 'HTTPS',
            status: 'Operational',
            uptime: '99.98%',
            latency: `${Math.floor(15 + Math.random() * 10)}ms`,
            icon: 'globe',
            history: Array.from({ length: 40 }, () => Math.random() > 0.99 ? 'down' : 'up')
        },
        {
            name: 'Analytics API',
            type: 'REST API',
            status: 'Operational',
            uptime: '100%',
            latency: '85ms',
            icon: 'bolt',
            history: Array.from({ length: 40 }, () => 'up')
        },
        {
            name: 'Firewall Defense',
            type: 'WAF',
            status: 'Operational',
            uptime: '100%',
            latency: '2ms',
            icon: 'shield',
            history: Array.from({ length: 40 }, () => 'up')
        },
        {
            name: 'Database Storage',
            type: 'SQLite (WAL)',
            status: 'Operational',
            uptime: '99.99%',
            latency: '4ms',
            icon: 'database',
            history: Array.from({ length: 40 }, () => 'up')
        }
    ];

    res.json({
        lastChecked: new Date().toLocaleTimeString(),
        components
    });
});

// 4. Serve Static Files
// Legacy Redirects
app.get('/adminperm/firewall.html', (req, res) => res.redirect('/firewall'));

// Serve public folder for status.html and others
app.use(express.static(path.join(__dirname, 'public')));
// Serve dist folder for the specific React App build
app.use(express.static(path.join(__dirname, 'dist'), { index: false }));

// 5. SPA Fallback & Dynamic Meta Injection
app.use((req, res) => {
    // Construct the absolute path to the index.html file
    const filePath = path.join(__dirname, 'dist', 'index.html');

    // If build doesn't exist yet, warn user
    if (!fs.existsSync(filePath)) {
        // Retrieve pure public/status.html if regular site is down/not built
        if (req.originalUrl === '/status') {
            return res.sendFile(path.join(__dirname, 'public', 'status.html'));
        }
        return res.status(404).send('Application build not found. Please run "npm run build".');
    }

    // Read the file from disk
    let html = fs.readFileSync(filePath, 'utf8');

    // --- Dynamic Meta Tag Injection (Fix for Embeds) ---
    const host = req.headers.host;
    const protocol = req.protocol; // http or https
    const fullUrl = `${protocol}://${host}${req.originalUrl}`;
    const domain = `${protocol}://${host}`;

    // Replace static placeholder URLs with the actual request URLs
    // This allows the embed to show the correct link regardless of where it's deployed
    html = html
        .replace(/content="https:\/\/velarix.digital\/"/g, `content="${domain}/"`)
        .replace(/content="https:\/\/velarix.digital"/g, `content="${domain}"`)
        .replace(/property="og:url" content=".*?"/, `property="og:url" content="${fullUrl}"`)
        .replace(/property="twitter:url" content=".*?"/, `property="twitter:url" content="${fullUrl}"`);

    // --- Dutch Notice Injection (from legacy logic) ---
    // If the middleware flagged this as a 'testDutch' or we detect NL region logic later
    if (req.query.testDutch === '1') {
        html = html.replace('<head>', '<head><script>window.FORCE_LEGAL_NOTICE = true;</script>');
    }

    res.send(html);
});

app.listen(port, () => {
    console.log(`Server running on port ${port} | Analytics & Shield Active`);
});
