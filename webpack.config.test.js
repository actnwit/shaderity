const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const baseConfig = require('./webpack.config.base.js');

const config = merge(baseConfig, {
  mode: 'development',
  entry: './src/index_test.ts',
  output: {
    filename: 'shaderity_test.js',
    chunkFilename: "shaderity-[name].js"
  }
});

module.exports = config;
