export const isArray = Array.isArray
export const objectToString = Object.prototype.toString

export function toTypeString (value) {
    return objectToString.call(value)
}

export function toRawType (value) {
    return toTypeString(value).slice(8, -1)
}

export function isFunction (val) {
    return typeof val === 'function'
}

export function isString (val) {
    return typeof val === 'string'
}

export function isNumeric (val) {
    return !isNaN(parseFloat(val)) && isFinite(val)
}

export function isValid (val) {
    return val !== undefined && val !== null && val !== ''
}

export function isSymbol (val) {
    return typeof val === 'symbol'
}

export function isObject (val) {
    return val !== null && typeof val === 'object'
}

export function isEmptyObject (value) {
    for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
            return false
        }
    }
    return true
}

export function isPromise (val) {
    return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export function toNumber (val) {
    const n = parseFloat(val)
    return isNaN(n) ? val : n
}

const onRE = /^on[^a-z]/

export function isOn (key) {
    return onRE.test(key)
}

export function NO () {
    return false
}
