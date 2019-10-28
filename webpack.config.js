const path = require('path');

module.exports = {
    mode: 'production',
    entry: './build/commonjs/intraframe.js',
    output: {
        filename: 'intraframe.js',
        path: path.join(__dirname, "./build/release")
    }
};