
module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
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
