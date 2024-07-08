/**
 * 分析模块对应的语法树
 * @param {*} ast  语法树 
 * @param {*} code   源代码
 * @param {*} module   模块实例
 */
function analyse(ast, code, module) {
    ast.body.forEach(statement => {
        Object.defineProperties(statement, {
            _inluded: {
                value: false, // 这条语句表示默认不包括在输出的结果里面
                writable: true
            },
            _module: {
                value: module, // 指向自己的模块
            },
            _source: { // 这个语句自己对应的源代码
                value: code.snip(statement.start, statement.end),
            }
        })
        // statement._module = module
        // statement._source = code.snip(statement.start, statement.end)
    });
}

module.exports = analyse