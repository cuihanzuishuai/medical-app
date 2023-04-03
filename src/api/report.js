import request from '@/common/request'

/**
 * 报单登记
 * @returns {Promise<unknown>}
 */
export function requestReportCreate (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/report/create', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 报单撤销
 * @returns {Promise<unknown>}
 */
export function requestReportRecover (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/report/delete', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 报单列表
 * @returns {Promise<unknown>}
 */
export function requestReportList (data) {
    return new Promise((resolve, reject) => {
        request.post('/api/report/list', data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 上传文件
 * @returns {Promise<unknown>}
 */
export function requestReportImport (file) {
    const formData = new FormData()
    formData.append('name', file.name)
    formData.append('file', file)
    return new Promise((resolve, reject) => {
        request.post('/api/report/import', formData, {
            'Content-Type': 'multipart/form-data;'
        })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

