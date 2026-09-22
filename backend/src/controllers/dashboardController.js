const pool = require('../config/database');
const { getStockTotals } = require('../utils/stock');

async function getDashboard(req, res) {
    const [[{ totalLadies }]] = await pool.query('SELECT COUNT(*) AS totalLadies FROM ladies');
    const totals = await getStockTotals();

    const [recent] = await pool.query(
        `SELECT d.id, d.quantity, d.distribution_date, l.name AS ladyName
         FROM pad_distribution d
         JOIN ladies l ON l.id = d.lady_id
         ORDER BY d.distribution_date DESC, d.id DESC
         LIMIT 10`
    );

    res.json({
        totalLadies: Number(totalLadies),
        totalPadsAdded: totals.totalAdded,
        totalPadsDistributed: totals.totalDistributed,
        availablePads: totals.available,
        recentDistributions: recent,
    });
}

module.exports = { getDashboard };
