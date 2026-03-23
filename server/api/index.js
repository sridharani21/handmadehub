// api/index.js
const serverless = require('serverless-http');
const app = require('../server'); // import your server.js

module.exports.handler = serverless(app);