const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { PanoramaManifestPlugin, PanoramaTargetPlugin } = require('webpack-panorama-x');
const { WatchIgnorePlugin } = require('webpack');

/** @type {import('webpack').Configuration} */
module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    output: {
        path: path.resolve(__dirname, 'layout/custom_game'),
        publicPath: 'file://{resources}/layout/custom_game/',
        chunkFormat: 'commonjs',
    },

    watchOptions: {
        aggregateTimeout: 1000, // 在1s内保存的所有文件都会被一次打包，因此也意味着每次按保存后要等一秒才能看到运行结果
    },

    optimization: {
        usedExports: true, // 启用 tree shaking
    },

    cache: {
        type: 'filesystem', // 降低首次运行的编译时间
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '...'],
        symlinks: false,
    },

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
        new PanoramaManifestPlugin({
            entries: [
                // js entires will be loaded in the scripts tag in the manifest
                { import: './utils/x-nettable-dispatcher.ts', filename: 'x-nettable-dispatcher.js' },

                // if type is not set, it will not be included in the manifest
                // usually used for loading screen, tooltips and popups which loaded
                // by engine or BLoadLayout etc.
                { import: './loading-screen/layout.xml', filename: 'custom_loading_screen.xml' },

                // provide type and filename to include in the manifest
                { import: './end_screen/layout.xml', type: 'EndScreen', filename: 'end_screen.xml' },

                // if filename is not set, it will use the name of the entry
                { import: './hud/layout.xml', type: 'Hud' },
            ],
        }),
        // use ignore plugin to ignore less files changes
        // they are watched and compiled in gulpfile.ts
        new WatchIgnorePlugin({ paths: [/\.less$/] }),
    ],
};
