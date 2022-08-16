const config = require('./webpack.config');

const TerserPlugin = require('terser-webpack-plugin');

config.optimization = {
    minimize: true,
    minimizer: [new TerserPlugin()],
};

module.exports = config;
