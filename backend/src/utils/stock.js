const pool = require('../config/database');

async function getStockTotals(connection = pool) {
    const [[{ totalAdded }]] = await connection.query(
        "SELECT COALESCE(SUM(quantity), 0) AS totalAdded FROM pad_stock"
    );
    const [[{ totalDistributed }]] = await connection.query(
        "SELECT COALESCE(SUM(quantity), 0) AS totalDistributed FROM pad_distribution"
    );

    return {
        totalAdded: Number(totalAdded),
        totalDistributed: Number(totalDistributed),
        available: Number(totalAdded) - Number(totalDistributed),
    };
}

module.exports = { getStockTotals };
