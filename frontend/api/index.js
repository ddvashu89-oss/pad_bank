// Vercel serverless entry point — same Express app used for local dev
// via api/src/server.js. Vercel calls this directly as a request handler.
const app = require('./src/app');

module.exports = app;
