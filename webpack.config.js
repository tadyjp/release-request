module.exports = {
  entry: {
    script: "./src/scripts/script.es6",
    background: "./src/background.es6"
  },
  output: {
    path: "./dist",
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.es6$/,
        exclude: /node_modules/,
        loader: "babel"
      }
    ]
  }
};
