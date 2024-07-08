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
