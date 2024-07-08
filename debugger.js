const path = require("path")

const rollup = require("./lib/rollup.js")

const entry = path.resolve(__dirname, "src/main.js")
const output = path.resolve(__dirname, "dist/bundle.js")

// 入口文件打包 
rollup(entry, output)