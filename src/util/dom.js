export function on (element, type, listener) {
    element.addEventListener(type, listener, false)
}

export function off (element, type, listener) {
    element.removeEventListener(type, listener, false)
}

export function once (element, type, fn) {
    function listener (...rest) {
        fn(...rest)
        off(element, type, listener)
    }

    on(element, type, listener)
}

export function hasClass (node, className) {
    if (node.classList) {
        return node.classList.contains(className)
    }
    const originClass = node.className
    return ` ${ originClass } `.indexOf(` ${ className } `) > -1
}

export function addClass (node, className) {
    if (node.classList) {
        node.classList.add(className)
    } else if (!hasClass(node, className)) {
        node.className = `${ node.className } ${ className }`
    }
}

export function removeClass (node, className) {
    if (node.classList) {
        node.classList.remove(className)
    } else if (hasClass(node, className)) {
        const originClass = node.className
        node.className = ` ${ originClass } `.replace(` ${ className } `, ' ')
    }
}
