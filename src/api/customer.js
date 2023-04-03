import request from '@/common/request'

/**
 * 给客服分配报单
 * @returns {Promise<unknown>}
 */
export function requestCustomerServerDistribute (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/customer/distribute', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 查看客服分配列表
 * @returns {Promise<unknown>}
 */
export function requestCustomerServerList (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/customer/report/list', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 客服回访结果
 * @returns {Promise<unknown>}
 */
export function requestCustomerServerResult (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/customer/report/result', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
