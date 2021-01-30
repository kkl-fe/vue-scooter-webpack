// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const vueScooterWebpackLoader = require('./vue-scooter-webpack-loader')
const { resolve } = require('path');
const projectRoot = process.cwd();
const DEFAULT_WORKSPACE = './src';
const VUE_SCOOTER_CONFIG_PATH = './vue-scooter.config.js';

let vueScooterConfig = {};
try {
  vueScooterConfig = require(resolve(projectRoot, VUE_SCOOTER_CONFIG_PATH));
} catch (error) {}

let workspace =  vueScooterConfig.workspace || DEFAULT_WORKSPACE

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
            options: {
              // pathList: [
              //   resolve(projectRoot, workspace, './index.js'),
              //   resolve(projectRoot, workspace, './routes.js'),
              // ],
              // pathReg: /src\/(index|router)(\/[.\w\/]{1,})?.js$/, // routes目录下所有的js
              pathReg: new RegExp(`${workspace}\/(index|router)(\/[.\w\/]{1,})?.js$`),
              replaceReg: /VueScooter.load/g,
              replacement: 'import',
              done: function(source) {
                return source;
              },
            },
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
          name: '[path][name].[ext]',
          esModule: false,
        },
      },
    ],
  },
  plugins: [
    // new VueScooterBuildWebpackPlugin(),
    // 请确保引入这个插件来施展魔法
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'style[hash].css',
    }),
  ],
};
