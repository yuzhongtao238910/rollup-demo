const MagicString = require("magic-string")
const { parse } = require("acorn")
const analyse = require("./ast/analyse.js")
class Module {
    constructor({ code, path, bundle}) {
        // code, // 模块的源代码
        // path: route, // 模块的路径
        // bundle: this // Bundle 的 实例
        this.code = new MagicString(code)
        this.path = path
        this.bundle = bundle
        // 先获取语法树
        this.ast = parse(this.code, {
            ecmaVersion: 6,
            sourceType: 'module'
        })
        // main.js 之中导入了name和age变量
        this.imports = {} // 存放本模块内部倒入了哪些变量
        // msg模块之中导出了name和age这两个变量
        this.exports = {}
        // 分析语法树
        analyse(this.ast, this.code, this)
    }
    expandAllStatements() {
        let allStatements = []
        this.ast.body.forEach(statement => {
            let statements = this.expandStatement(statement)
            allStatements.push(...statements)
        })
        return allStatements
    }
    expandStatement(statement) {
        statement._included = true
        let result = []
        result.push(statement)
        return result
    }
}
module.exports = Module
