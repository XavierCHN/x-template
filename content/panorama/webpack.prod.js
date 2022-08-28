const config = require('./webpack.dev');

const TerserPlugin = require('terser-webpack-plugin');

config.optimization = {
    minimize: true,
    minimizer: [new TerserPlugin()],
};

module.exports = config;
