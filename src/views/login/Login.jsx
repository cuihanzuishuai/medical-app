import { defineComponent, reactive } from 'vue'
import { Form, Field, CellGroup, Button } from 'vant'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const loginForm = reactive({
            username: '',
            password: ''
        })

        function onSubmit (values) {
            console.log(values)
        }

        return () => {
            return (
                <div class={ cx('view-wrap', 'login') }>
                    <Form onSubmit={ onSubmit }>
                        <CellGroup inset={ true }>
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
                        </CellGroup>
                        <div class={ cx('button-wrap') }>
                            <Button
                                round={ true }
                                block={ true }
                                type="primary"
                                native-type="submit"
                            >
                                登录
                            </Button>
                        </div>
                    </Form>
                </div>
            )
        }
    }
})
