const acorn = require("acorn")

const sourceCode = `import $ from "jquery"`

const ast = acorn.parse(sourceCode, {
    locations: true,
    ranges: true,
    sourceType: 'module',
    ecmaVersion: 5
})
// 遍历语法树
// console.log(ast);
ast.body.forEach(statement => {
    walk(statement, {
        enter(node) {
            if (node.type) {
                console.log(node.type, "enter, 进入节点");
            }
            
        },
        leave(node) {
            if (node.type) {
                console.log(node.type, "enter, 离开节点");
            }
        }
    })
})

function walk(astNode, {enter, leave}) {
    visit(astNode, null, enter, leave)
}
function visit(node, parent, enter, leave) {
    if (enter) {
        enter(node, parent)
    }
    const keys = Object.keys(node).filter(key => typeof node[key] === 'object' && node[key])
    // console.log(keys);
    keys.forEach(key => {
        let value = node[key]
        if (Array.isArray(value)) {
            value.forEach(val => {
                if (val.type) {
                    visit(val, node, enter, leave)
                }
            })
        } else if (value && value.type) {
            visit(value, node, enter, leave)
        }
    })  
    if (leave) {
        leave(node, parent)
    }

}