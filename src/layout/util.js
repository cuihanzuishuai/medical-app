import { hasOneOf } from '@/util/tools'

/**
 * 判断子元素 children
 */
function hasChild (item) {
    return !!(item.children && item.children.length !== 0)
}

/**
 * hasAccess
 */
function hasAccess (route, access) {
    if (route.meta && route.meta.access && route.meta.access.length) {
        return hasOneOf(access, route.meta.access)
    } else {
        return true
    }
}

/**
 * 生成动态路由 list
 */
export function getMenuList (routers, access) {
    const arr = []
    routers.forEach((item) => {
        if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
            const obj = {
                icon: (item.meta && item.meta.icon) || '',
                name: item.name,
                meta: item.meta
            }
            if (hasChild(item) && hasAccess(item, access)) {
                obj.children = getMenuList(item.children, access)
            }
            if (hasAccess(item, access)) {
                arr.push(obj)
            }
        }
    })
    return arr
}

/**
 * 一个子元素时 独占一行 不生成下拉菜单
 */
export function showChildren (item) {
    return !!(item.children && item.children.length > 1)
}

/**
 * 权鉴
 */
export function canTurnTo (name, routes, access) {
    function routePermissionJudge (list) {
        return list.some((item) => {
            if (item.children && item.children.length) {
                return routePermissionJudge(item.children)
            } else if (item.name === name) {
                return hasAccess(item, access)
            }
        })
    }

    return routePermissionJudge(routes)
}
