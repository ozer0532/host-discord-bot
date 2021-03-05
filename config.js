const fs = require('fs');

if (!fs.existsSync('./config.json')) {
    fs.writeFileSync('./config.json', JSON.stringify({}))
}

const config = require('./config.json');

module.exports = function(name) {
    return config[name] || process.env[name];
} 