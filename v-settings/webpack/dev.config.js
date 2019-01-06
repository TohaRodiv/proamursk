const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

//Основные настройки
module.exports = merge(baseConfig, {
    entry: ['babel-polyfill', './cp_vue/frontend/vue/main.js'],
    output: {
        path: path.resolve(__dirname, '/../../dist'),
        publicPath: '/dist/',
        filename: 'build.js'
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        filename: 'build.js',
        publicPath: '/dist/'
    },
    performance: {
        hints: false
    },
    devtool: 'inline-source-map',
});


//Плагины

module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': `"development"`
        }
    }),
    new VueLoaderPlugin(),
]);
