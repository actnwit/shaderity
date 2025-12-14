const merge = require('webpack-merge').merge;
const webpack = require('webpack');
const path = require('path');
const baseConfig = require('./webpack.config.base.js');

const config = merge(baseConfig, {
  mode: 'development',
  output: {
    filename: 'shaderity.js',
    chunkFilename: 'shaderity-[name].js',
    path: path.resolve(__dirname, './../../dist/umd'),
    library: {
      name: 'Shaderity',
      type: 'umd',
      export: 'default',
    },
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
});

module.exports = config;
