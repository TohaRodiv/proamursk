const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const VueLoaderPlugin = require('vue-loader/lib/plugin');


//Основные настройки
module.exports = merge(baseConfig, {
    entry: ['babel-polyfill', './cp_vue/frontend/vue/main.js'],
    output: {
        path: path.resolve(__dirname, '../../static/cp_vue'),
        publicPath: '/static/cp_vue/',
        filename: 'build.js'
    },
    performance: { hints: false },
    devtool: '#eval-source-map'
});


//Плагины
module.exports.devtool = '#source-map';
module.exports.plugins = (module.exports.plugins || []).concat([
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
    new UglifyJsPlugin({
        uglifyOptions: {
            ecma: 7,
            warnings: false,
            parallel: true,
            output: {
                comments: false,
                beautify: false
            },
            toplevel: false,
            nameCache: null,
            ie8: false,
            keep_classnames: undefined,
            keep_fnames: false,
            safari10: false
        }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
    new MiniCssExtractPlugin({ filename: "css/styles.css", publicPath: './' }),
    new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip'
    }),

    new CopyWebpackPlugin([
        {
            from: path.resolve(__dirname, "../../formatter/js/formatter.js"), to: path.resolve(__dirname, "../../static/cp_vue/js")
        },
        {
            from: path.resolve(__dirname, "../../formatter/css/demo.css"), to: path.resolve(__dirname, "../../static/cp_vue/css/formatter")
        },
        { 
            from: path.resolve(__dirname, "../../v-settings/src/css/formatter_content.css"), to: path.resolve(__dirname, "../../static/cp_vue/css/formatter")
        },
        { 
            from: path.resolve(__dirname, "../../formatter/images/icons/"), to: path.resolve(__dirname, "../../static/cp_vue/css/images/icons")
        }
    ])
]);