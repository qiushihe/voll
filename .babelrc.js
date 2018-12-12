module.exports = {
  "plugins": [
    "@babel/plugin-syntax-object-rest-spread",
    "@babel/plugin-proposal-object-rest-spread",
    ["provide-modules", { "react": "React" }],
    ["module-resolver", {
      "root": ".",
      "alias": {
        "/src": "./src"
      }
    }]
  ],
  "presets": [
    ["@babel/env"],
    ["@babel/react"]
  ]
}
