const MagicString = require('magic-string')
const { parse } = require('acorn')
const analyse = require('./ast/analyse.js')
const {hasOwnProperty} = require("./ast/utils.js")
class Module {
	constructor({ code, path, bundle }) {
		// code, // 模块的源代码
		// path: route, // 模块的路径
		// bundle: this // Bundle 的 实例
		this.code = new MagicString(code)
		this.path = path
		this.bundle = bundle
		// 先获取语法树
		this.ast = parse(this.code, {
			ecmaVersion: 6,
			sourceType: 'module',
		})
		// main.js 之中导入了name和age变量
		this.imports = {} // 存放本模块内部倒入了哪些变量
		// msg模块之中导出了name和age这两个变量
		this.exports = {}
		// 存放本模块的顶级变量的定义语句是哪一条
		this.definitions = {}
		// 分析语法树
		analyse(this.ast, this.code, this)
		// console.log(this.imports, '导入')
		// console.log(this.exports, '导出')
		// console.log(this.definitions, 'definitions')
	}
	expandAllStatements() {
		let allStatements = []
		this.ast.body.forEach((statement) => {
            if (statement.type === 'ImportDeclaration') {
                return
            }
			let statements = this.expandStatement(statement)
			allStatements.push(...statements)
		})
		return allStatements
	}
	expandStatement(statement) {
		statement._included = true
		let result = []
        // 找到此语句使用到的变量 把这些变量定义的语句取出来，放到result数组之中
        const _dependsOn = Object.keys(statement._dependsOn)
        _dependsOn.forEach(name => {
            // 找到此变量的定义的语句 添加到结果之中
            let definitions = this.define(name)
            result.push(...definitions)
        })
        // console.log(_dependsOn, 444)
		result.push(statement)
		return result
	}
    define(name) {
        // 区分此变量是函数内部自己声明的，还是外部导入的
        if (hasOwnProperty(this.imports, name)) {
            // 说明是外部引入的
            // 获取是从哪个模块导入的哪个变量
            const {source, importName} = this.imports[name]
            // 获取导入的模块
            // this.path 是入口的路径 source是相对于当前模块的路径 相对路径
            const importedModule = this.bundle.fetchModule(source, this.path)
            const { localName } = importedModule.exports[importName] // msg.js
            return importedModule.define(localName)
        } else {
            // 如果非i导入模块是 本地的模块的话
            // 获取此变量的变量的定义语句
            let statement = this.definitions[name]
            if (statement && !statement._included) {
                return this.expandStatement(statement)
            } else {
                return []
            }
        }
    }
}
module.exports = Module
