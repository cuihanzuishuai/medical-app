/**
 * 判断要查询的数组是否至少有一个元素包含在目标数组中
 * @param target 目标 [1]
 * @param arr 靶 [1, 2, 3]
 * @return boolean
 */
export function hasOneOf (target, arr) {
    return target.some((item) => {
        return arr.indexOf(item) > -1
    })
}

/**
 * 判断元素存在数组中
 */
export function oneOf (value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true
        }
    }
    return false
}

/**
 * 判断时间戳格式是否是毫秒
 */
export function isMillisecond (timeStamp) {
    // '1627575231010'.length 13
    // 正常时间戳13位 秒级10位
    // isMillisecond(time) ? moment(time) : moment(time * 1000)
    const timeStr = String(timeStamp)
    return timeStr.length > 10
}

