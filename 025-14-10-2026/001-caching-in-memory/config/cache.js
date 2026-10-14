const NodeCache = require('node-cache');

const cache = new NodeCache({
    stdTTL: 60,       // Default expiration: 60 seconds
    checkperiod: 320  // Check expired keys every 120 seconds
});

module.exports = cache;
