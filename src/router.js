import { createRouter, createWebHistory } from 'vue-router'
import { closeToast, closeDialog, closeNotify } from 'vant'
import { getToken, removeToken } from '@/common/auth'
import { LOGIN_NAME, HOME_NAME } from '@/config'
import useDirection from '@/store/direction'
import useUserinfo from '@/store/userinfo'
import routes from '@/routes'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

let isPush = false
let methods = ['push', 'go', 'replace', 'forward', 'back']
methods.forEach((key) => {
    let method = router[key].bind(router)
    router[key] = function (...args) {
        isPush = true
        method.apply(null, args)
    }
})

router.beforeEach((to, from, next) => {
    closeToast()
    closeDialog()
    closeNotify()
    const direction = useDirection()
    direction.updateDirection(to.path, from.path, isPush)
    next()
})

// function turnTo (to, next, access) {
//     if (canTurnTo(to.name, routes, access)) {
//         next()
//     } else {
//         next({ replace: true, name: 'error-401' })
//     }
// }
//
// router.beforeEach((to, from, next) => {
//     const userinfo = useUserinfo()
//     const token = getToken()
//     if (!token && to.name !== LOGIN_NAME) {
//         next({ name: LOGIN_NAME })
//     } else if (!token && to.name === LOGIN_NAME) {
//         next()
//     } else if (token && to.name === LOGIN_NAME) {
//         next({ name: HOME_NAME })
//     } else {
//         if (userinfo.hasGetInfo) {
//             turnTo(to, next, userinfo.access)
//         } else {
//             Loading()
//             userinfo.getUserInfo()
//                 .then((access) => {
//                     turnTo(to, next, access)
//
//                     setTimeout(() => {
//                         userinfo.getUserInfo()
//                     }, 1000)
//                 })
//                 .catch((err) => {
//                     removeToken()
//                     Modal.error({
//                         title: 'Error',
//                         content: err.message,
//                         onOk: () => {
//                             next({ name: LOGIN_NAME })
//                         }
//                     })
//                 })
//                 .finally(() => {
//                     Loading.destroy()
//                 })
//         }
//     }
// })

export default router
