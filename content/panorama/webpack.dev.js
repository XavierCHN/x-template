const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { PanoramaManifestPlugin, PanoramaTargetPlugin } = require("@demon673/webpack-panorama");

/** @type {import('webpack').Configuration} */
module.exports = {
    mode: "development",
    context: path.resolve(__dirname, "src"),
    output: {
        path: path.resolve(__dirname, "layout/custom_game"),
        publicPath: "file://{resources}/layout/custom_game/",
        chunkFormat: "commonjs"
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", "..."],
        symlinks: false,
    },

    module: {
        rules: [
            {
                test: /\.xml$/,
                loader: "@demon673/webpack-panorama/lib/layout-loader",
                options: {
                    cacheable: true, // layout 启用了cache，避免xml文件重复加载，如果添加了新xml文件，请重新run webpack
                },
            },
            {
                test: /\.[jt]sx$/,
                issuer: /\.xml$/,
                loader: "@demon673/webpack-panorama/lib/entry-loader",
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: { transpileOnly: true },
            },
            {
                test: /\.js?$|\.jsx?$/,
                loader: "babel-loader",
                exclude: [/node_modules/, /sync_keyvalues/],
                options: { presets: ["@babel/preset-react", "@babel/preset-env"] },
            },
            {
                test: /\.css$/,
                test: /\.(css|less)$/,
                issuer: /\.xml$/,
                loader: "file-loader",
                options: { name: "[path][name].css", esModule: false },
            },
            {
                test: /\.less$/,
                loader: "less-loader",
                options: {
                    additionalData: (content) => {
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
        new PanoramaManifestPlugin({
            entries: [
                { import: "./utils/sync_keyvalues.js" },
                {
                    import: "./loading-screen/layout.xml",
                    filename: "custom_loading_screen.xml",
                },
                { import: "./hud/layout.xml", type: "Hud" },
                { import: "./end_screen/layout.xml", type: "EndScreen" },
            ],
            // 这是一个临时的解决方案，应该作为一个永久性的变更放到webpack-panorama中
            minify: false,
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: path.resolve(__dirname, "tsconfig.json"),
            },
        }),
    ],
};
