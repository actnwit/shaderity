const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(glsl|vs|fs|vert|frag)$/i,
        exclude: /node_modules/,
        use: ['shaderity-loader']
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            module: "ESNext",
            declaration: false
          }
        }
      },
    ]
  },
  resolve: {
    extensions: [
      '.ts'
    ]
  },
  output: {
    publicPath: "/dist/", // Change the path to load splitted code chunks according to your wish.
  },
  optimization: {
    namedChunks: true
  }
};
