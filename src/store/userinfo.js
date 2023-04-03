import { defineStore } from 'pinia'
import { requestUserInfo } from '@/api/user'
import { Admin } from '@/permission'

const useUserinfo = defineStore('userinfo', {
    state: () => {
        return {
            // 有无用户数据
            hasGetInfo: false,
            // 用户权限信息
            access: [],
            // 超管
            isAdmin: false,
            // 离职状态 1正常 2离职
            status: 1,
            // 用户名
            name: ''
        }
    },
    actions: {
        getUserInfo () {
            return new Promise((resolve, reject) => {
                requestUserInfo()
                    .then((res) => {
                        this.$patch((state) => {
                            state.hasGetInfo = true
                            state.isAdmin = res.is_admin
                            if (res.is_admin) {
                                state.access = [Admin]
                            } else {
                                state.access = [String(res.role)]
                            }
                            state.status = res.status
                            state.name = res.name
                            resolve(state.access)
                        })
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        }
    }
})

export default useUserinfo
