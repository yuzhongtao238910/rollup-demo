class Scope {
	constructor(options = {}) {
		// 作用域的名称
		this.name = options.name
		// 父级的作用域
		this.parent = options.parent
		// 此作用域之中定义的变量
		this.names = options.names || []
	}
	add(name) {
		this.names.push(name)
	}
	findDefiningScope(name) {
		// 获取访问定义的作用域
		if (this.names.includes(name)) {
			return this
		} else if (this.parent) {
			return this.parent.findDefiningScope(name)
		} else {
			return null
		}
	}
}

module.exports = Scope
