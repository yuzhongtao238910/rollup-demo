const Bundle = require("./bundle.js")
/**
 * 打包入口文件 把结果输出到目录
 * @param {*} entry 入口文件
 * @param {*} output  输出目录加上文件名字
 */
function rollup(entry, output) {
    const bundle = new Bundle({entry})
    bundle.build(output)
}

module.exports = rollup