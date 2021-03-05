const config = require('./config.json');

module.exports = function(name) {
    return config[name] || process.env[name];
} 