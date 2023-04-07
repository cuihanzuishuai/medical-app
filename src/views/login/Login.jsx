import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Field, Button, showNotify } from 'vant'
import { requestLogin } from '@/api/user'
import { setToken } from '@/common/auth'
import { HOME_NAME } from '@/config'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const router = useRouter()

        const loading = ref(false)

        const loginForm = reactive({
            username: '',
            password: ''
        })

        function onSubmit (values) {
            const data = {
                mobile: loginForm.username,
                password: loginForm.password
            }
            loading.value = true
            requestLogin(data)
                .then((res) => {
                    if (res.token) {
                        setToken(res.token)
                        router.push({ name: HOME_NAME })
                    } else {
                        showNotify({
                            type: 'warning',
                            message: '系统异常'
                        })
                    }
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

        return () => {
            return (
                <div class={ cx('view-wrap', 'login') }>
                    <div class={ cx('form-wrap') }>
                        <Form onSubmit={ onSubmit }>
                            <Field
                                v-model={ loginForm.username }
                                name="username"
                                label="手机号"
                                placeholder="请输入"
                                rules={ [{ required: true, message: '请输入手机号' }] }
                            />
                            <Field
                                v-model={ loginForm.password }
                                type="password"
                                name="password"
                                label="密码"
                                placeholder="请输入"
                                rules={ [{ required: true, message: '请输入密码' }] }
                            />
                            <div class={ cx('button-wrap') }>
                                <Button
                                    round={ true }
                                    block={ true }
                                    type="primary"
                                    loading={ loading.value }
                                    native-type="submit"
                                >
                                    登录
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            )
        }
    }
})
