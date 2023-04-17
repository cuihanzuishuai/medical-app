import { defineComponent, reactive, ref } from 'vue'
import { Field, Form, NavBar, showNotify, Button, showConfirmDialog, showDialog } from 'vant'
import { useRouter } from 'vue-router'
import { requestUserChangePasswd } from '@/api/user'
import { removeToken } from '@/common/auth'
import { LOGIN_NAME } from '@/config'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const router = useRouter()

        const loading = ref(false)

        const formData = reactive({
            old_passwd: '',
            new_passwd: ''
        })

        function onUserChangePasswd () {
            const data = {
                old_passwd: formData.old_passwd,
                new_passwd: formData.new_passwd
            }
            loading.value = true
            requestUserChangePasswd(data)
                .then(() => {
                    removeToken()
                    showDialog({
                        title: '修改成功',
                        message: '请重新登录！'
                    })
                        .then(() => {
                            router.replace({ name: LOGIN_NAME })
                        })
                })
                .catch((err) => {
                    showNotify({
                        type: 'warning',
                        message: err.message
                    })
                })
                .finally(() => {
                    loading.value = false
                })
        }

        function onSubmit () {
            showConfirmDialog({
                message: '确定修改密码？'
            })
                .then(() => {
                    onUserChangePasswd()
                })
        }

        function onBackPrev () {
            router.go(-1)
        }

        return () => {
            return (
                <div class={ cx('view-wrap', 'wrap-flex') }>
                    <NavBar
                        title="修改密码"
                        leftArrow={ true }
                        onClickLeft={ onBackPrev }
                    />
                    <div class={ cx('scroll-wrap') }>
                        <Form onSubmit={ onSubmit }>
                            <Field
                                label="旧密码"
                                type="password"
                                placeholder="请输入旧密码"
                                v-model={ formData.old_passwd }
                                rules={ [{ required: true, message: '请输入旧密码' }] }
                            />
                            <Field
                                label="新密码"
                                type="password"
                                placeholder="请输入新密码"
                                v-model={ formData.new_passwd }
                                rules={ [{ required: true, message: '请输入新密码' }] }
                            />
                            <div class={ cx('button-wrap') }>
                                <Button
                                    round={ true }
                                    block={ true }
                                    type="primary"
                                    loading={ loading.value }
                                    native-type="submit"
                                >
                                    确认修改
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            )
        }
    }
})
