const config = require('./webpack.dev');

const TerserPlugin = require('terser-webpack-plugin');

config.optimization = {
    usedExports: true, // 启用 tree shaking
    minimize: true,
    minimizer: [new TerserPlugin()],
};

config.mode = 'production';

module.exports = config;
