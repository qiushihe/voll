const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const babelRc = require("./.babelrc");

module.exports = function () {
  return {
    target: "electron-main",
    entry: {
      bundle: path.resolve(__dirname, "src/index"),
      main: path.resolve(__dirname, "src/main")
    },
    output: {
      filename: "[name].js",
      sourceMapFilename: "[name].js.map",
      path: path.resolve(__dirname, "build")
    },
    resolve: {
      extensions: [".js", ".jsx"],
      alias: {
        "/src": path.resolve(__dirname, 'src')
      }
    },
    module: {
      rules: [{
        test: /\.(png|jp(e*)g|svg)$/,
        exclude: /node_modules/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: "images/[hash]-[name].[ext]"
          }
        }
      }, {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelRc
        }
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({
        excludeChunks: ["main"],
        template: path.resolve(__dirname, "templates", "index.html")
      }),
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, "templates", "package.json"), to: path.resolve(__dirname, "build")
      }])
    ]
  };
};
