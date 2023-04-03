import request from '@/common/request'

/**
 * 登录
 * @returns {Promise<unknown>}
 */
export function requestLogin (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/login', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 注销
 * @returns {Promise<unknown>}
 */
export function requestLogout (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/logout', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 用户信息
 * @returns {Promise<unknown>}
 */
export function requestUserInfo (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/user/info', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 修改密码
 * @returns {Promise<unknown>}
 */
export function requestUserChangePasswd (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/user/change_passwd', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 创建用户
 * @returns {Promise<unknown>}
 */
export function requestUserCreate (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/user/create', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 修改权限 暂不实现
 * @returns {Promise<unknown>}
 */
export function requestUserChangeRole (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/user/change/role', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 更改用户状态为离职
 * @returns {Promise<unknown>}
 */
export function requestUserChangeStatus (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/user/change/status', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 用户列表
 * @returns {Promise<unknown>}
 */
export function requestUserList (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/user/list', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
