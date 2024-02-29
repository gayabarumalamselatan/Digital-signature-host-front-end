const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const dotenv = require('dotenv');
const CopyWebpackPlugin = require('copy-webpack-plugin');


// Call dotenv and it will return an Object with a parsed key 
const env = dotenv.config({ path: './.env.production' }).parsed;

// Reduce it to a nice object, the same as before (but with the variables from .env)
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

module.exports = {
    entry: './src/index.js',
    mode: "production",
    output: {
        //... existing output configuration
        path: path.resolve(__dirname, 'gritcore'),
        filename: '[name].[contenthash].bundle.js',
        clean: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 3000,
        historyApiFallback: true, // This option enables fallback to index.html
        hot: true,
    },
    module: {
        rules: [
            // Existing rule for JavaScript and JSX files
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"],
                        },
                    },
                ],
            },
            // New rule for CSS files
            {
                test: /\.css$/,
                use: [
                    "style-loader", // Creates `style` nodes from JS strings
                    "css-loader",   // Translates CSS into CommonJS
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            templateParameters: {
                'publicPath': '/' // you can also use an environment variable or a dynamic value
            },
            template: "./public/index.html",
            favicon: './public/favicon.ico',
            filename: './index.html',

        }),
        new Dotenv(),
        new webpack.DefinePlugin(envKeys),
        new CopyWebpackPlugin({
            patterns: [
              { from: 'public/dist', to: 'dist' },
              { from: 'public/plugins', to: 'plugins' },
              // You can add more patterns here if needed
            ]
          }),

        // Menambahkan plugin ModuleFederationPlugin
        new ModuleFederationPlugin({
            name: 'webeai-front', // Nama aplikasi host
            remotes: {
                gritswiftmodule: 'gritswiftmodule@http://10.8.135.84:3001/remoteSwiftModule.js',
                gritbifastmodule: 'gritbifastmodule@http://10.8.135.84:3002/bifastModule.js',
                gritsmartinmodule: 'gritsmartinmodule@http://10.8.135.84:3003/smartinModule.js',
                gritmoneymarketmodule: 'gritmoneymarketmodule@http://10.8.135.84:3004/moneyMarketModule.js',
                grittrademodule: 'grittrademodule@http://10.8.135.84:3007/tradeModule.js'
            },
            shared: { // Mendefinisikan dependensi yang dibagi
                react: {
                    singleton: true,
                    eager: true,
                    requiredVersion: '^18.2.0' // Ganti dengan versi React yang digunakan dalam aplikasi Anda
                },
                'react-dom': {
                    singleton: true,
                    eager: true,
                    requiredVersion: '^18.2.0' // Ganti dengan versi yang sesuai
                },
                // Anda bisa menambahkan lebih banyak dependensi yang dibagi di sini
            },
        }),
    ],
    resolve: {
        extensions: [".js", ".jsx"],
    },
    target: "web",
};
