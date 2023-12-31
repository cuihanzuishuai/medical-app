import axios from 'axios'
import { baseURL, LOGIN_NAME } from '@/config'
import { getToken, removeToken } from '@/common/auth'
import { showDialog } from 'vant'
import Loading from '@/components/loading'
import router from '@/router'

function addErrorLog (err) {
    if (err) {
        const errorLog = {
            type: 'axios',
            code: err.status,
            mes: err.statusText,
            url: err.request.responseURL
        }
        console.log(errorLog)
    }
}

function onExpireToken (err) {
    removeToken()
    showDialog({
        title: 'Error',
        message: err.message
    })
        .then(() => {
            router.replace({ name: LOGIN_NAME })
        })
}

const instance = axios.create({
    baseURL: baseURL(),
    timeout: 5000 * 2,
    headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
    },
    validateStatus (status) {
        return status >= 200 && status < 300
    }
})

instance.interceptors.request.use(
    (config) => {
        const token = getToken()
        if (token) {
            config.headers['token'] = `${ token }`
        }
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)
instance.interceptors.response.use(
    (res) => {
        return res
    },
    (err) => {
        const data = err.response && err.response.data
        if (data && data.message) {
            err.message = data.message
            err.code = data.code
        }
        if (/ExpireToken/.test(err.code)) {
            onExpireToken(err)
            Loading.destroy()
            return new Promise(() => ({}))
        }
        // addErrorLog(err.response)
        return Promise.reject(err)
    }
)

export default instance
