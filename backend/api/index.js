// Vercel serverless entry point. Wraps the same Express app used by
// src/server.js for local dev — Vercel calls this directly as a request
// handler instead of us calling app.listen().
const app = require('../src/app');

module.exports = app;
