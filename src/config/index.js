// token过期时间 默认一天
export const cookieExpires = 1

// 记住密码过期时间 默认30天
export const recallExpires = 30

// icon 在线地址
export const scriptUrl = '//at.alicdn.com/t/c/font_3980375_cbczlwhxpvl.js'

// 首页
export const HOME_NAME = '_home'

// 登录页
export const LOGIN_NAME = 'login'

// 环境变量
const ENV_OBJ = {
    development: {
        baseURL: 'http://124.222.33.20:8080'
    },
    production: {
        baseURL: 'http://124.222.33.20:8080'
    }
}

const VITE_VUE_APP_ENV = import.meta.env.VITE_VUE_APP_ENV
const ENV_TARGET = ENV_OBJ[VITE_VUE_APP_ENV]

export function baseURL () {
    return ENV_TARGET.baseURL
}

