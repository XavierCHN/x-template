const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { PanoramaManifestPlugin, PanoramaTargetPlugin } = require("webpack-panorama");

/** @type {import('webpack').Configuration} */
const isProduction = process.env.NODE_ENV === "production";
module.exports = {
    mode: isProduction ? "production" : "development",
    context: path.resolve(__dirname, "src"),
    // devtool: isProduction ? false : 'eval-inline-source-map',
    output: {
        path: path.resolve(__dirname, "layout/custom_game"),
        publicPath: "file://{resources}/layout/custom_game/",
    },

    resolve: {
        extensions: [".ts", ".tsx", "..."],
        symlinks: false,
    },

    module: {
        rules: [
            {
                test: /\.xml$/,
                loader: "webpack-panorama/lib/layout-loader",
            },
            {
                test: /\.[jt]sx?$/,
                issuer: /\.xml$/,
                loader: "webpack-panorama/lib/entry-loader",
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: { transpileOnly: true },
            },
            {
                test: /\.(css|less)$/,
                issuer: /\.xml$/,
                loader: "file-loader",
                options: { name: "[path][name].css", esModule: false },
            },
            {
                test: /\.less$/i,
                loader: "less-loader",
                options: {
                    additionalData: (content) => {
                        content = content.replace(/@keyframes ([a-zA-Z_]+\w+)/g, (match, name) => {
                            // add apostrophe to satisfy valve
                            return match.replace(name, `'${name}'`);
                        });
                        return content;
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
                    import: "./loading-screen/layout.xml",
                    filename: "custom_loading_screen.xml",
                },
                { import: "./hud/layout.xml", type: "Hud" },
                { import: "./end_screen/layout.xml", type: "EndScreen" },
            ],
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: path.resolve(__dirname, "tsconfig.json"),
            },
        }),
    ],
};
