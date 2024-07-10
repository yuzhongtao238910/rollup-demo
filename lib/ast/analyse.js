const walk = require('./walk.js')
const Scope = require('./scope.js')
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
			_dependsOn: {
				value: {}, // 依赖的变量
			},
			_defines: {
				value: {},
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

	// 我们还需要这个变量是局部变量  还是全局变量
	// 一上来先创建顶级作用域
	let currentScope = new Scope({
		name: '模块内部的顶级作用域',
	})
	ast.body.forEach((statement) => {
		function addToScope(name) {
			// 把此变量名字 添加到当前作用域的变量数组之中
			currentScope.add(name)
			if (!currentScope.parent) {
				// 如果说当前的作用域没有父级作用域了，说明他就是顶级的作用域
				// 那么此变量就是顶级变量

				// 表示此语句定义了一个顶级变量
				statement._defines[name] = true
				// 此顶级变量的定义语句 就是这条语句
				module.definitions[name] = statement
			}
		}
		walk(statement, {
			enter(node) {
				if (node.type === 'Identifier') {
					// 表示当前的这个语句依赖了node.name这个变量
					statement._dependsOn[node.name] = true
				}
				let newScope
				switch (node.type) {
					case 'FunctionDeclaration':
						addToScope(node.id.name) // 把函数名字添加到当前的作用域变量之中
						const names = node.params.map((param) => param.name)
						// 遇到函数声明的话，创建一个新的作用域
						newScope = new Scope({
							name: node.id.name,
							parent: currentScope, // 当创建新的作用域的时候，父作用域就是当前的作用域
							names,
						})
						break
					case 'VariableDeclaration':
						node.declarations.forEach((declaration) => {
							addToScope(declaration.id.name)
						})
						break
					default:
						break
				}
				if (newScope) {
					Object.defineProperty(node, '_scope', {
						value: newScope,
					})
					currentScope = newScope
				}
			},
			leave(node) {
				// 如果当前的节点上有 _scope 说明她的当前的节点创建了一个新的作用域
				if (Object.hasOwnProperty(node, '_scope')) {
					currentScope = currentScope.parent
				}
			},
		})
	})
	ast.body.forEach((statement) => {
		console.log(statement._defines, 126)
		// console.log(statement.de, 126)
	})
}
/**
 * 创建作用域链条
 *
 * 只关心顶级变量，那么没有爸爸的作用域定义的变量
 *
 * 找到顶级变量
 *
 */
module.exports = analyse
