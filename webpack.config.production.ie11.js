
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(glsl|vs|fs|vert|frag)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: path.resolve('./loader/index.js'),
            options: {}
          }
        ]
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'ts-loader',
        options: {
          configFile: "tsconfig.ie11.json"
        }
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts'
    ]
  },
  output: {
    publicPath: "/dist/", // Change the path to load splitted code chunks according to your wish.
    filename: 'shaderity.min.ie11.js',
    chunkFilename: "shaderity-[name].min.ie11.js"
  },
   optimization: {
     namedChunks: true
  }
};
