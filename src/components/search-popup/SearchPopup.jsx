import { defineComponent, ref } from 'vue'
import { Popup, Form, Button } from 'vant'
import { pxToVw } from '@/util/tools'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    emits: ['finish', 'reset'],
    setup (props, { emit, slots, expose }) {
        const formRef = ref(null)

        const visible = ref(false)

        function onReset () {
            emit('reset')
        }

        function onFinish (values) {
            visible.value = false
            emit('finish', values)
        }

        function show () {
            visible.value = true
        }

        expose({
            show
        })

        return () => {
            const popupStyles = {
                width: pxToVw(628),
                height: '100%'
            }
            return (
                <Popup v-model:show={ visible.value } position="right" style={ popupStyles }>
                    <Form class={ cx('form-wrap') } ref={ formRef }>
                        <div class={ cx('header-wrap') }/>
                        <div class={ cx('field-wrap') }>
                            { slots.default ? slots.default() : null }
                        </div>
                        <div class={ cx('button-wrap') }>
                            <Button
                                class={ cx('button', 'button__left') }
                                block={ true }
                                round={ true }
                                onClick={ onReset }
                            >
                                重置
                            </Button>
                            <Button
                                class={ cx('button', 'button__right') }
                                block={ true }
                                round={ true }
                                onClick={ onFinish }
                                loading={ props.loading }
                                type="primary"
                                htmlType="submit"
                            >
                                查询
                            </Button>
                        </div>
                    </Form>
                </Popup>
            )
        }
    }
})
