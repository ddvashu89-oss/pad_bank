const pool = require('../config/database');

async function getAnalytics(req, res) {
    const [stockByMonth] = await pool.query(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS ym,
                DATE_FORMAT(created_at, '%b %Y') AS label,
                SUM(quantity) AS total
         FROM pad_stock
         GROUP BY ym, label`
    );

    const [distributionByMonth] = await pool.query(
        `SELECT DATE_FORMAT(distribution_date, '%Y-%m') AS ym,
                DATE_FORMAT(distribution_date, '%b %Y') AS label,
                SUM(quantity) AS total
         FROM pad_distribution
         GROUP BY ym, label`
    );

    const monthMap = new Map();
    for (const row of stockByMonth) {
        monthMap.set(row.ym, { ym: row.ym, label: row.label, added: Number(row.total), distributed: 0 });
    }
    for (const row of distributionByMonth) {
        const existing = monthMap.get(row.ym);
        if (existing) {
            existing.distributed = Number(row.total);
        } else {
            monthMap.set(row.ym, { ym: row.ym, label: row.label, added: 0, distributed: Number(row.total) });
        }
    }
    const monthlyTrend = [...monthMap.values()].sort((a, b) => a.ym.localeCompare(b.ym));

    const [topLadies] = await pool.query(
        `SELECT l.id, l.name, COUNT(*) AS visits, SUM(d.quantity) AS totalPads
         FROM pad_distribution d
         JOIN ladies l ON l.id = d.lady_id
         GROUP BY l.id, l.name
         ORDER BY totalPads DESC
         LIMIT 5`
    );

    const [[{ totalDistributions }]] = await pool.query(
        'SELECT COUNT(*) AS totalDistributions FROM pad_distribution'
    );
    const [[{ activeLadies }]] = await pool.query(
        'SELECT COUNT(DISTINCT lady_id) AS activeLadies FROM pad_distribution'
    );
    const [[{ totalPadsDistributed }]] = await pool.query(
        'SELECT COALESCE(SUM(quantity), 0) AS totalPadsDistributed FROM pad_distribution'
    );

    const avgPadsPerVisit =
        totalDistributions > 0 ? Math.round((totalPadsDistributed / totalDistributions) * 10) / 10 : 0;

    res.json({
        monthlyTrend,
        topLadies: topLadies.map((l) => ({
            id: l.id,
            name: l.name,
            visits: Number(l.visits),
            totalPads: Number(l.totalPads),
        })),
        totalDistributions: Number(totalDistributions),
        activeLadies: Number(activeLadies),
        avgPadsPerVisit,
    });
}

module.exports = { getAnalytics };
