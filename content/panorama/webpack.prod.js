const config = require('./webpack.dev');

const TerserPlugin = require('terser-webpack-plugin');

config.optimization = {
    minimize: true,
    minimizer: [new TerserPlugin()],
};

config.mode = 'production';

module.exports = config;
