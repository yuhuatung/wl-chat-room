const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    publicPath: '',
    lintOnSave: false,
    css: { extract: true },
    configureWebpack: {
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        ecma: 6,
                        compress: true,
                        output: {
                            comments: false,
                            beautify: false
                        }
                    }
                })
            ]
        },
        resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
        module: {
            rules: [
                {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
                }
            ]
        }
    },
    chainWebpack(config) {
        config.module
            .rule("vue")
            .use("vue-loader")
            .loader("vue-loader")
            .tap(options => {
                options.compilerOptions.whitespace = "condense";
                return options
            });
    }
};