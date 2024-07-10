const path = require("path")
const fs = require("fs")
const Module = require("./module.js")
const MagicString = require("magic-string")
/*
在不使用任何插件的情况下
整个项目只会有一个bundle
会有很多个模块
*/
class Bundle {
    constructor(options) {
        //入口文件的绝对路径
        this.entryPath = path.resolve(options.entry.replace(/\.js$/, "") + ".js")
        this.modules = new Set()
    }
    build(output) {
        // 获取模块
        const entryModule = this.fetchModule(this.entryPath)
        // 展开语句
        this.statements = entryModule.expandAllStatements()
        // console.log(this.statements)
        const {code} = this.generate()
        fs.writeFileSync(output, code)
        // console.log('entryModule', entryModule)
    }   
    generate() {
        // 把所有的语句的源代码拼接在一起就是生成代码了
        const bundle = new MagicString.Bundle()
        this.statements.forEach(statement => {
            const source = statement._source.clone()
            if (statement.type === 'ExportNamedDeclaration') {
                source.remove(statement.start, statement.declaration.start)
            }

            // if (statement.type === 'ImportDeclaration') {
            //     source.remove(statement.start, statement.end)
            // }
            // 把每个语句对应的源代码都添加到bundle这个实例之中
            bundle.addSource({
                content: source,
                separator: "\n"
            })
        });
        // 返回 合并后的 源代码
        return {
            code: bundle.toString()
        }

    }
    // 根据模块的路径
    /**
     *  创建模块的实例
     * @param {*} importee 被引入的模块 ./msg.js
     * @param {*} importer 引入的模块，负责引入别的模块的模块 main.js
     * @returns 
     */
    fetchModule(importee, importer) {
        let route
        if (!importer) {
            route = importee
        } else {
            if (path.isAbsolute(importee)) {
                route = importee.replace(/\.js$/, "") + ".js"
            } else {
                route = path.resolve(path.dirname(importer), importee.replace(/\.js$/, "") + ".js")
            }
        }
        if (route) {
            // 1- 先读取文件对应的内容
            const code = fs.readFileSync(route, "utf8")
            // 2- 创建一个模块的实例
            const module = new Module({
                code, // 模块的源代码
                path: route, // 模块的路径
                bundle: this // Bundle 的 实例
            })
            // console.log(module)
            this.modules.add(module)
            return module
        }
    }
    
}

module.exports = Bundle
/**
 * rollup之中的Bundle  webpack.Compiler
 * 
 * webpack之中一切都是模块 file module
 * rollup之中也是一样的， file module 每个文件也是一个模块的
 */