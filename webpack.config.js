const resolvePath = require("path").resolve;
const flow = require("lodash/fp/flow");
const get = require("lodash/fp/get");
const find = require("lodash/fp/find");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const babelRc = require("./.babelrc");

const moduleResolverAlias = flow([
  get("plugins"),
  find(function (plugin) { return plugin[0] === "module-resolver"; }),
  get("1.alias")
])(babelRc);

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
      alias: moduleResolverAlias
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
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[hash]-[name].[ext]"
          }
        }
      }, {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelRc
        }
      }, {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({
        excludeChunks: ["main"],
        template: resolvePath(__dirname, "src", "templates", "index.html")
      }),
      new CopyWebpackPlugin([
        { from: resolvePath(__dirname, "src", "templates", "package.json"), to: resolvePath(__dirname, "build") }
      ])
    ]
  };
};
