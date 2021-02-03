// webpack.config.js
const { resolve } = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackCleanDistPlugin = require('webpack-clean-dist-plugin')

const { PROJECT_ROOT } = require('./const')
const { VueScooterHtmlPlugin } = require('./html')
const VUE_SCOOTER_CONFIG_PATH = './vue-scooter.config.js'
const { getOptions } = require('./options')

let vueScooterConfig = {}
try {
  vueScooterConfig = require(resolve(PROJECT_ROOT, VUE_SCOOTER_CONFIG_PATH))
} catch (error) {}
const { rawEditOptions } = getOptions(vueScooterConfig)

module.exports = {
  mode: 'production',
  output: {
    filename: '[name][hash].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      // 它会应用到普通的 `.js` 文件
      // 以及 `.vue` 文件中的 `<script>` 块
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'raw-edit-loader',
            options: rawEditOptions.js,
          },
        ],
      },
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.(css|less)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[name][hash].[ext]',
          esModule: false,
        },
      },
    ],
  },
  plugins: [
    new WebpackCleanDistPlugin(),
    // 请确保引入这个插件来施展魔法
    new VueLoaderPlugin(),
    new VueScooterHtmlPlugin({
      origin: HtmlWebpackPlugin,
      ...rawEditOptions.html,
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'style[hash].css',
    }),
  ],
}
