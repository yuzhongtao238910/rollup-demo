const walk = require('./walk.js')
/**
 * 分析模块对应的语法树
 * @param {*} ast  语法树
 * @param {*} code   源代码
 * @param {*} module   模块实例
 */
function analyse(ast, code, module) {
	// 开启第一轮的循环 找出本模块导入导出了哪些变量
	ast.body.forEach((statement) => {
		Object.defineProperties(statement, {
			_inluded: {
				value: false, // 这条语句表示默认不包括在输出的结果里面
				writable: true,
			},
			_module: {
				value: module, // 指向自己的模块
			},
			_source: {
				// 这个语句自己对应的源代码
				value: code.snip(statement.start, statement.end),
			},
		})
		// statement._module = module
		// statement._source = code.snip(statement.start, statement.end)

		if (statement.type === 'ImportDeclaration') {
			// 获取导入模块的相对路径
			let source = statement.source.value
			statement.specifiers.forEach((specifier) => {
				let importName = specifier.imported.name // 导入的变量的名字
				let localName = specifier.local.name // 当前模块的变量名字
				// 当前模块的导入的变量的名字localName来自于 source 模块导出的  importName
				module.imports[localName] = {
					source,
					importName,
				}
			})
		} else if (statement.type === 'ExportNamedDeclaration') {
			const declaration = statement.declaration
			if (declaration && declaration.type === 'VariableDeclaration') {
				const declarations = declaration.declarations
				declarations.forEach((VariableDeclarator) => {
					const localName = VariableDeclarator.id.name
					const exportName = localName
					// export {k as kk}
					module.exports[exportName] = {
						localName,
					}
				})
			}
		}
	})

	// 开启第二轮循环 创建作用域链
	// 我们需要知道本模块内部用到了什么变量，用到的变量的话就留下，没有用到的话就不管了
	ast.body.forEach((statement) => {
		walk(statement, {
			enter(node) {
				if (node.type) {
				}
			},
			leave(node) {},
		})
	})
}

module.exports = analyse
