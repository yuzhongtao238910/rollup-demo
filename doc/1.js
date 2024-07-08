// const MagicString = require("magic-string")
class MagicString {
    constructor(code) {
        this.code = code
    }
    snip(start, end) {
        return new MagicString(this.code.slice(start, end))
    }
    remove(start, end) {
        return new MagicString(this.code.slice(0, start) + this.code.slice(end))
    }
    toString() {
        return this.code
    }
    clone() {
        return new MagicString(this.code)
    }
}
MagicString.Bundle = class Bundle {
    constructor() {
        this.sources = []
    }
    addSource(source) {
        this.sources.push(source)
    }
    toString() {
        return this.sources.reduce((result, {content, separator}) => {
            result += content
            result += separator
            return result
        }, ``)
    }
}

const sourceCode = `export const name = "zhufeng"`

const ms = new MagicString(sourceCode)

console.log(ms)
console.log(ms.snip(0, 6).toString()); // slice(0, 6)
console.log(ms.remove(0, 7).toString()); // const name = "zhufeng"

// 还可以用来拼接字符串
let bundle = new MagicString.Bundle()
bundle.addSource({
    content: `var a = 1`,
    separator: "\n"
})

bundle.addSource({
    content: `var b = 1`,
    separator: "\n"
})

console.log(bundle.toString());