const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


if (process.env.NODE_ENV === 'development') {
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                },
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.sass$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                },
                {
                    test: /\.css/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                    ],
                },
                {
                    test: /\.(gif|png|jpe?g|ico|svg)$/i,       /*Лоадер картинок*/
                    loaders: [
                        {
                            loader: 'file-loader',
                            options: {
                                exclude: [path.resolve(__dirname, "../../v-settings/src/fonts")],
                                name: 'images/[name].[ext]'
                            }
                        },
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|svg)$/,     /*Лоадер-шрифтов*/
                    exclude: [
                        /node_modules/,
                        path.resolve(__dirname, "../../v-settings/src/images"),
                    ],
                    loader: 'url-loader?limit=1024&name=fonts/[name].[ext]'
                },
            ]
        },
    };
}

else if (process.env.NODE_ENV === 'production') {
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                },
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            'presets': [
                                'es2015',
                                'stage-0',
                                'stage-2'
                            ],
                            'babelrc': false
                        }
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.sass$/,
                    use: ExtractTextPlugin.extract({
                        use: [{
                            loader: 'css-loader'
                        }, {
                            loader: 'sass-loader'
                        }],
                    }),
                    // use style-loader in development
                    // fallback: 'style-loader'
                },
                {
                    test: /\.css/,
                    loader: 'style-loader!css-loader'
                },
                {
                    test: /\.(gif|png|jpe?g|ico|svg)$/i,       /*Лоадер картинок*/
                    loaders: [
                        {
                            loader: 'file-loader',
                            options: {
                                exclude: path.resolve(__dirname, "../../cp_vue/frontend/src/fonts"),
                                name: 'images/[name].[ext]'
                            }
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                gifsicle: {
                                    interlaced: false,
                                },
                                optipng: {
                                    optimizationLevel: 7,
                                },
                                pngquant: {
                                    quality: '65-90',
                                    speed: 4
                                },
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65
                                },
                            }
                        },
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|svg)$/,     /*Лоадер-шрифтов*/
                    exclude: [
                        /node_modules/,
                        path.resolve(__dirname, "../../v-settings/src/images"),
                    ],
                    loader: 'url-loader?limit=1024&name=fonts/[name].[ext]'
                },
            ]
        },
    };
}


