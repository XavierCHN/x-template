const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { PanoramaManifestPlugin, PanoramaTargetPlugin } = require('webpack-panorama-x');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

const entries = require('./entries.config');
const entry = Object.assign({}, entries);

/** @type {import('webpack').Configuration} */
module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    output: {
        path: path.resolve(__dirname, 'layout/custom_game'),
        publicPath: 'file://{resources}/layout/custom_game/',
        chunkFormat: 'commonjs',
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '...'],
        symlinks: false,
    },

    // entries from entries.config.js
    entry: entry,

    module: {
        rules: [
            {
                test: /\.xml$/,
                loader: 'webpack-panorama-x/lib/layout-loader',
                options: {},
            },
            {
                test: /\.[jt]sx$/,
                issuer: /\.xml$/,
                loader: 'webpack-panorama-x/lib/entry-loader',
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: { transpileOnly: true },
            },
            {
                test: /\.js?$|\.jsx?$/,
                loader: 'babel-loader',
                exclude: [/node_modules/],
                options: { presets: ['@babel/preset-react', '@babel/preset-env'] },
            },
            {
                test: /\.css$/,
                test: /\.(css|less)$/,
                issuer: /\.xml$/,
                loader: 'file-loader',
                options: { name: '[path][name].css', esModule: false },
            },
            {
                test: /\.less$/,
                loader: 'less-loader',
                options: {
                    additionalData: content => {
                        content = content.replace(/@keyframes\s*(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g, (match, name) => {
                            // add apostrophe to satisfy valve
                            return match.replace(name, `'${name}'`);
                        });
                        return content;
                    },
                    lessOptions: {
                        relativeUrls: false,
                    },
                },
            },
        ],
    },

    plugins: [
        new PanoramaTargetPlugin(),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
        }),
        new ReplaceInFileWebpackPlugin([
            {
                dir: 'content/panorama/layout/custom_game',
                test: /\.js$/,
                rules: [
                    {
                        search: /new Function\(\'return this\'\)\(\)/g,
                        replace: 'globalThis',
                    },
                ],
            },
        ]),
    ],
};
