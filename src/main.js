// import { name } from "./msg.js"
import { name, age } from './msg.js'

// 我们需要判断哪些变量 是一级变量 或者说是顶级变量 局部变量不需要处理的
function say() {
	console.log('hello', name)
}
say()
// console.log("hello");
// console.log("world");
// console.log(name)
/**
 * expand 展开
 * 就是把入口模块里面的每个语句，用到的变量 把他们的变量的定义也取过来
 *
 * import { name } from "./msg.js"
 *
 *
 * const name = "apple"
 */
