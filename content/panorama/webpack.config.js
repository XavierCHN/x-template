const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { PanoramaManifestPlugin, PanoramaTargetPlugin } = require('webpack-panorama');

/** @type {import('webpack').Configuration} */
module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    output: {
        path: path.resolve(__dirname, 'layout/custom_game'),
        publicPath: 'file://{resources}/layout/custom_game/',
    },

    resolve: {
        extensions: ['.ts', '.tsx', '...'],
        symlinks: false,
    },

    module: {
        rules: [
            {
                test: /\.xml$/,
                loader: 'webpack-panorama/lib/layout-loader',
            },
            {
                test: /\.[jt]sx?$/,
                issuer: /\.xml$/,
                loader: 'webpack-panorama/lib/entry-loader',
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: { transpileOnly: true },
            },
            {
                test: /\.css$/,
                test: /\.(css|s[ac]ss)$/,
                issuer: /\.xml$/,
                loader: 'file-loader',
                options: { name: '[path][name].css', esModule: false },
            },
            {
                test: /\.s[ac]ss$/,
                loader: 'sass-loader',
                options: {
                    implementation: require("dart-sass"),
                    sassOptions: {
                        outputStyle: "expanded",
                    },
                },
            },
        ],
    },

    plugins: [
        new PanoramaTargetPlugin(),
        new PanoramaManifestPlugin({
            entries: [
                {
                    import: './loading-screen/layout.xml',
                    filename: 'custom_loading_screen.xml',
                },
                { import: './hud/layout.xml', type: 'Hud' },
                { import: './end_screen/layout.xml', type: 'EndScreen' },
            ],
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
        }),
    ],
};
