function walk(astNode, { enter, leave }) {
	// console.log(astNode, 2)
	visit(astNode, null, enter, leave)
}
function visit(node, parent, enter, leave) {
	if (enter) {
		enter(node, parent)
	}
	const keys = Object.keys(node).filter(
		(key) => typeof node[key] === 'object' && node[key]
	)
	console.log(keys)
	keys.forEach((key) => {
		let value = node[key]
		if (Array.isArray(value)) {
			value.forEach((val) => {
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

module.exports = walk
