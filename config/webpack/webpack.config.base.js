module.exports = {
  entry: './src/index.ts',

  module: {
    rules: [{
      test: /\.ts$/,
      exclude: [/node_modules/],
      loader: 'ts-loader',
    }, ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['node_modules'],
  },
  output: {
    publicPath: './../../dist/', // Change the path to load splitted code chunks according to your wish.
  },
  optimization: {
    chunkIds: 'named',
  },
};
