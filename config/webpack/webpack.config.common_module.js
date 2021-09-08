const merge = require('webpack-merge').merge;
const webpack = require('webpack');
const path = require('path');
const baseConfig = require('./webpack.config.base.js');

const config = merge(baseConfig, {
  target: 'node',
  mode: 'development',
  output: {
    filename: 'index.js',
    chunkFilename: 'shaderity-[name].js',
    path: path.resolve(__dirname, './../../dist/esm'),
    libraryTarget: 'commonjs-module',
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
});

module.exports = config;
