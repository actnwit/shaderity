const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const baseConfig = require('./webpack.config.base.js');

const config = merge(baseConfig, {
  mode: 'development',
  entry: './src_for_test/index_test.ts',
  output: {
    filename: 'index_test.js'
  }
});

module.exports = config;
