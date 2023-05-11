const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const PORT = 3030;
const PROXY = "http://localhost:8000";

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.join(__dirname, "build"),
    filename: "main.js",
    publicPath: "/",
  },
  devtool: "eval-source-map",
  devServer: {
    compress: true,
    hot: true,
    port: PORT,
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: `http://localhost:${PORT}`,
        router: () => PROXY,
      },
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
