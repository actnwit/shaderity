const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src_for_test/index_test.js',
  module: {
    rules: [
      {
        test: /\.(glsl|vs|fs|vert|frag)$/i,
        exclude: /node_modules/,
        use: ['shaderity-loader']
      }
    ]
  },
  output: {
    filename: 'index_test.js'
  }
};
