import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { Cell, Button, showConfirmDialog } from 'vant'
import useUserinfo from '@/store/userinfo'
import { removeToken } from '@/common/auth'
import { LOGIN_NAME } from '@/config'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'
import AVATAR from './images/avatar.png'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const router = useRouter()

        const userinfo = useUserinfo()

        function handleLogOut () {
            showConfirmDialog({
                message: '确认退出登录吗？',
            })
                .then(() => {
                    removeToken()
                    router.push({ name: LOGIN_NAME })
                })
        }

        return () => {
            return (
                <div class={ cx('user-view') }>
                    <div class={ cx('user-info') }>
                        <div class={ cx('user-avatar') }>
                            <img src={ AVATAR } alt="avatar"/>
                        </div>
                        <div class={ cx('user-name') }>{ userinfo.name }</div>
                    </div>
                    <Cell title="修改密码" isLink={ true }/>
                    <div class={ cx('button-wrap') }>
                        <Button round={ true } block={ true } onClick={ handleLogOut }>退出登录</Button>
                    </div>
                </div>
            )
        }
    }
})
