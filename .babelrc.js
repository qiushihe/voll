const resolvePath = require("path").resolve;

module.exports = {
  "plugins": [
    "babel-plugin-styled-components",
    "@babel/plugin-syntax-object-rest-spread",
    "@babel/plugin-proposal-object-rest-spread",
    ["provide-modules", { "react": "React" }],
    ["module-resolver", {
      "root": __dirname,
      "alias": {
        "/src": resolvePath(__dirname, "src", ""),
        "/main": resolvePath(__dirname, "src", "main"),
        "/renderer": resolvePath(__dirname, "src", "renderer"),
        "/templates": resolvePath(__dirname, "src", "templates")
      }
    }]
  ],
  "presets": [
    ["@babel/env"],
    ["@babel/react"]
  ]
}
