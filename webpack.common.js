const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isFirefoxSafari = process.env.TARGET == "safari-firefox";

const TARGET_FOLDER = ["dist", isFirefoxSafari ? "safari-firefox" : "chromium"];

module.exports = (env) => {
    const isProduction = env == "production";

    const config = {
        entry: {
            options: [path.join(__dirname, "src", "options", "options")],
            contentScript: path.join(
                __dirname,
                "src",
                "contentScript",
                "contentScript"
            ),
            backgroundScript: path.join(
                __dirname,
                "src",
                "backgroundScript",
                "backgroundScript"
            ),
        },
        output: {
            filename: "[name].bundle.js",
            clean: true,
            path: path.resolve(__dirname, ...TARGET_FOLDER),
        },
        plugins: [copyManifestToDist(isProduction), copyIconsToDist()],
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ["babel-loader"],
                },
                {
                    test: /\.(ts|tsx)$/i,
                    loader: "ts-loader",
                    exclude: ["/node_modules/"],
                },
                {
                    test: /\.(woff|woff2)$/i,
                    include: [
                        path.resolve(
                            __dirname,
                            "node_modules/@patternfly/react-core/dist/styles/assets/fonts"
                        ),
                        path.resolve(
                            __dirname,
                            "node_modules/@patternfly/react-core/dist/styles/assets/pficon"
                        ),
                    ],
                    type: "asset/resource",
                    generator: {
                        filename: "fonts/[name][ext]",
                    },
                },
            ],
        },
        performance: {
            hints: false,
        },
        resolve: {
            extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
        },
    };
    return config;
};

function copyManifestToDist(isProduction) {
    function getModifiedManifest(content) {
        const manifest = JSON.parse(content.toString());

        if (isFirefoxSafari) {
            // for Firefox/Safari, background scripts are declared in the manifest differently
            const backgroundScript = manifest.background.service_worker;
            manifest.background = { scripts: [backgroundScript] };
        } else {
            // for Chromium based browsers browser_specific_settings is not supported
            delete manifest["browser_specific_settings"];
        }

        // For production, reference the generated content script css created by MiniCssExtractPlugin
        if (isProduction) {
            manifest.content_scripts[0]["css"] = ["contentScript.css"];
        }

        return JSON.stringify(
            {
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...manifest,
            },
            null,
            isProduction ? null : 2
        );
    }

    return new CopyWebpackPlugin({
        patterns: [
            {
                from: "manifest.json",
                to: path.join(__dirname, ...TARGET_FOLDER),
                force: true,
                transform: function (content, _path) {
                    return Buffer.from(getModifiedManifest(content));
                },
            },
        ],
    });
}

function copyIconsToDist() {
    return new CopyWebpackPlugin({
        patterns: [
            {
                from: "src/assets/icons",
                to: path.join(__dirname, ...TARGET_FOLDER),
                force: true,
            },
        ],
    });
}
