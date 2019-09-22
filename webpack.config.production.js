const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');

const config = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: 'shaderity.min.js',
    chunkFilename: "shaderity-[name].min.js"
  }
});

module.exports = config;
