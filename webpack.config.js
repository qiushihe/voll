const resolvePath = require("path").resolve;

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const babelRc = require("./.babelrc");

module.exports = function () {
  return {
    target: "electron-main",
    entry: {
      bundle: resolvePath(__dirname, "src/renderer"),
      main: resolvePath(__dirname, "src/main")
    },
    output: {
      filename: "[name].js",
      sourceMapFilename: "[name].js.map",
      path: resolvePath(__dirname, "build")
    },
    resolve: {
      extensions: [".js", ".jsx"],
      alias: {
        "/src": resolvePath(__dirname, 'src')
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
        template: resolvePath(__dirname, "src", "templates", "index.html")
      }),
      new CopyWebpackPlugin([
        { from: resolvePath(__dirname, "src", "templates", "package.json"), to: resolvePath(__dirname, "build") },
        { from: resolvePath(__dirname, "src", "images", "lolgo-512.png"), to: resolvePath(__dirname, "build") },
        { from: resolvePath(__dirname, "src", "images", "lolgo.ico"), to: resolvePath(__dirname, "build") },
        { from: resolvePath(__dirname, "src", "images", "lolgo-512.icns"), to: resolvePath(__dirname, "build") }
      ])
    ]
  };
};
