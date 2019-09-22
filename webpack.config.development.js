const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base.js');

const config = merge(baseConfig, {
  mode: 'development',
  output: {
    filename: 'shaderity.js',
    chunkFilename: "shaderity-[name].js"
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
});

module.exports = config;
