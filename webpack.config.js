var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  entry: './reactSwineApp/app.js',
  output: {
    path: __dirname + '/build',
    filename: 'game.js'
  },
  plugins: [
    new HtmlWebpackPlugin({title: 'SwineSweeper', template: 'game.html'}),
    new ExtractTextPlugin("styles.css"),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react'],
            plugins: ['transform-object-rest-spread']
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
