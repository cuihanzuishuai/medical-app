import request from '@/common/request'

/**
 * 市场部统计
 * @returns {Promise<unknown>}
 */
export function requestStatisticsMarket (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/statistics/market', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 客服部统计
 * @returns {Promise<unknown>}
 */
export function requestStatisticsCustomer (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/statistics/customer', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
