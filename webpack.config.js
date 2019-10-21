const path = require('path');
const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'docs');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const getRules = function (mode) {
    const rules = [
        // js, jsx
        {
            test: /\.(js|jsx)$/,
            exclude: /node_module/,
            use: ['babel-loader']
        },
        // css,scss
        {
            test: /\.(css|scss)$/,
            use: [
                // fallback to style-loader in development
                mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                "css-loader",
                "sass-loader"
            ]
        },
        // images
        {
            test: /\.(png|svg|jpe?g|gif)$/i,
            use:[
                {
                    loader: 'file-loader',
                    options: {
                        publicPath: 'assets',
                        name: '[path][name].[ext]?[hash]',
                        context: 'src',
                        outputPath: '',
                        useRelativePath: false
                    }
                }
            ]
        },
    ];
    return rules;
}

const getPlugins = function (mode) {
    let plugins = [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(src, 'index.html'),
            filename: 'index.html',
            // inject: 'body'
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "assets/css/[name]_[hash].css",
            chunkFilename: "assets/css/[id]_[hash].css"
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'            
        }),
        new CopyWebpackPlugin([
            { from: src + '/assets/images', to: dist + '/assets/images' },
            {
                from: src + '/static'
            },

        ]),
    ];
    if (mode === 'production') {
        plugins.unshift(new CleanWebpackPlugin());
    }
    return plugins;
}

let config = {
    entry: {
        index: path.resolve(src, 'index.js')
    },
    output: {
        filename: '[name].js',
        path: dist,
        publicPath: ''
    },
    devtool: 'inline-source-map',
    devServer: {
        port: 8081,
        contentBase: dist,
        hot: true
    },
    module: {
        rules: []
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    plugins: []
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'source-map';
        config.output = {
            filename: '[name].js',
            path: dist
        };
    }

    if (argv.mode === 'production') {
        config.output = {
            filename: '[name]_[hash].min.js',
            path: dist
        };
    }

    config.module.rules = getRules(argv.mode);
    config.plugins = getPlugins(argv.mode);

    return config;
}