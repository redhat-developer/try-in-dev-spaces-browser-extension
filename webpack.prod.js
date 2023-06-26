const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");

module.exports = merge(common("production"), {
    mode: "production",
    devtool: false,
    entry: {
        // Have custom styles specific to the options page be a seperate chunk
        // This is done so that the css import order in the options html page can be set
        optionsStyles: [
            path.join(__dirname, "src", "options", "styles", "App.css"),
        ],
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin({}),
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: ["default", { mergeLonghand: false }],
                },
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', "css-loader"],
            },
        ],
    },
    plugins: [
        copyOptionsHtmlToDist(),
        new MiniCssExtractPlugin(),
    ],
});

function copyOptionsHtmlToDist() {
    return new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "options", "options.html"),
        filename: "options.html",
        // have custom options styles be defined AFTER the default react patternfly styles
        chunks: ["options", "optionsStyles"],
        chunksSortMode: "manual",
    });
}
