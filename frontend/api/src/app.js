const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const ladyRoutes = require('./routes/ladyRoutes');
const stockRoutes = require('./routes/stockRoutes');
const distributionRoutes = require('./routes/distributionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const systemRoutes = require('./routes/systemRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/ladies', ladyRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/distributions', distributionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/system', systemRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

// Centralized error handler — controllers throw/reject and let this catch it.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
