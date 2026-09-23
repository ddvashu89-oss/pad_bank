const pool = require('../config/database');

async function getStatus(req, res) {
    const status = {
        database: {
            connected: false,
            host: process.env.DB_HOST,
            name: process.env.DB_NAME,
            latencyMs: null,
            error: null,
        },
        counts: null,
        checkedAt: new Date().toISOString(),
    };

    try {
        const start = Date.now();
        await pool.query('SELECT 1');
        status.database.connected = true;
        status.database.latencyMs = Date.now() - start;

        const [[{ users }]] = await pool.query('SELECT COUNT(*) AS users FROM users');
        const [[{ ladies }]] = await pool.query('SELECT COUNT(*) AS ladies FROM ladies');
        const [[{ stockEntries }]] = await pool.query('SELECT COUNT(*) AS stockEntries FROM pad_stock');
        const [[{ distributions }]] = await pool.query(
            'SELECT COUNT(*) AS distributions FROM pad_distribution'
        );

        status.counts = {
            users: Number(users),
            ladies: Number(ladies),
            stockEntries: Number(stockEntries),
            distributions: Number(distributions),
        };
    } catch (err) {
        status.database.connected = false;
        status.database.error = err.code || err.message;
    }

    res.json(status);
}

module.exports = { getStatus };
