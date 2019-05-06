const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


if (process.env.NODE_ENV === 'development') {
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            scss: 'vue-style-loader!css-loader!sass-loader',
                            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                        }
                    }
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
                            comments: false,
                            'babelrc': false
                        }
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.sass$/,
                    use: [
                        'vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                indentedSyntax: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(gif|png|jpe?g|ico|svg)$/i,       /*Лоадер картинок*/
                    loaders: [
                        {
                            loader: 'file-loader',
                            options: {
                                exclude: [path.resolve(__dirname, '../../v-settings/src/fonts')],
                                name: 'images/[name].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|svg)$/,     /*Лоадер-шрифтов*/
                    exclude: [/node_modules/, path.resolve(__dirname, '../../v-settings/src/images')],
                    loader: 'url-loader?limit=1024&name=fonts/[name].[ext]'
                }
            ]
        }
    };
}

else if (process.env.NODE_ENV === 'production') {
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            extractCSS: true,
                            scss: 'vue-style-loader!css-loader!sass-loader',
                            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                        }
                    }
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
                            comments: false,
                            babelrc: false
                        }
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.sass$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../'
                            }
                        },
                        {
                            loader: 'css-loader',
                            // options: {
                            //     url: false
                            // }
                        },
                        {
                            loader: 'sass-loader',
                            options: { indentedSyntax: true }
                        }
                    ]
                },
                {
                    test: /\.(gif|png|jpe?g|ico|svg)$/i,       /*Лоадер картинок*/
                    loaders: [
                        {
                            loader: 'url-loader',
                            options: {
                                exclude: path.resolve(__dirname, '../../cp_vue/frontend/src/fonts'),
                                name: 'images/[name].[ext]',
                                limit: 50
                            }
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                gifsicle: { interlaced: false },
                                optipng: { optimizationLevel: 7 },
                                pngquant: {
                                    quality: '65-90',
                                    speed: 4
                                },
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65
                                },
                                url: false
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|svg)$/,     /*Лоадер-шрифтов*/
                    exclude: [
                        /node_modules/,
                        path.resolve(__dirname, '../../v-settings/src/images'),
                        path.resolve(__dirname, '../../static/')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 50000,
                                name: 'fonts/[name].[ext]' 
                            }
                        }
                    ]
                }
            ]
        }
    };
}
