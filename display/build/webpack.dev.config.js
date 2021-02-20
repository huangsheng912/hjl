const path = require("path");
const merge = require('webpack-merge')
const webpack = require('webpack')
const commonConfig = require('./webpack.base.config.js')
const openBrowserPlugin = require("open-browser-webpack-plugin");

const PORT = process.env.PORT || 8883
module.exports = merge(commonConfig, {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    app:[
      "react-hot-loader/patch",
      path.resolve(__dirname, '../src/main.js')
    ]
  },
  output: {
    filename:"[name].js",
  },
  devServer: {
    hot: true,
    port: PORT,
    host: '0.0.0.0',
    progress: true,
    historyApiFallback: true,
    overlay: {
      errors: true
    },
    clientLogLevel: "none",
    proxy: {
      "/jsonrpc": {
        // target: "http://192.168.1.130:18081",
        target: "https://hj.yuyanji360.com",
        // pathRewrite: {"^/dev" : ""},
        changeOrigin: true,
      },
    }

  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new openBrowserPlugin({url: "http://localhost:"+PORT})
  ],
});