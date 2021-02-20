
module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 2
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": [
    "react-hot-loader/babel",//menu动态import路由+react-hot-loader实现热替换异常，添加后热更新都出问题
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-dynamic-import",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties",{ "loose" : true}],
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }]
  ],
  "ignore": [/[\/\\]core-js/, /@babel[\/\\]runtime/],
  "sourceType": 'unambiguous'
}