import { defineComponent, reactive, ref } from 'vue'
import { Field, Form, NavBar, showNotify, Button, showConfirmDialog } from 'vant'
import TimePopup from '@/components/time-popup'
import { useRouter } from 'vue-router'
import { requestReportCreate } from '@/api/report'
import dayjs from 'dayjs'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const router = useRouter()
        const timeRef = ref(null)

        const loading = ref(false)

        const formData = reactive({
            consumer_mobile: '',
            consumer_name: '',
            except_arrive_time: ''
        })

        function onCreateReport () {
            const data = {
                consumer_mobile: formData.consumer_mobile,
                consumer_name: formData.consumer_name,
                expect_arrive_time: formData.except_arrive_time ? dayjs(formData.except_arrive_time, 'YYYY/MM/DD HH:mm').unix() : 0
            }
            loading.value = true
            requestReportCreate(data)
                .then((res) => {
                    showNotify({
                        type: 'primary',
                        message: '添加成功'
                    })
                    onReset()
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
                message: '确定无误并提交？'
            })
                .then(() => {
                    onCreateReport()
                })
        }

        function onReset () {
            Object.keys(formData).forEach((key) => {
                formData[key] = ''
            })
        }

        function onBackPrev () {
            router.go(-1)
        }

        function onShowTimePopup () {
            timeRef.value && timeRef.value.show()
        }

        return () => {
            return (
                <div class={ cx('view-wrap', 'wrap-flex') }>
                    <NavBar
                        title="报表登记"
                        leftArrow={ true }
                        onClickLeft={ onBackPrev }
                    />
                    <div class={ cx('scroll-wrap') }>
                        <Form onSubmit={ onSubmit }>
                            <Field
                                label="客户姓名"
                                placeholder="请输入"
                                v-model={ formData.consumer_name }
                                rules={ [{ required: true, message: '请输入客户姓名' }] }
                            />
                            <Field
                                label="客户电话"
                                placeholder="请输入"
                                v-model={ formData.consumer_mobile }
                                rules={ [{ required: true, message: '请输入客户电话' }] }
                            />
                            <Field
                                label="预期到访时间"
                                placeholder="请选择"
                                v-model={ formData.except_arrive_time }
                                readonly={ true }
                                isLink={ true }
                                onClick={ onShowTimePopup }
                                rules={ [{ required: true, message: '请选择到访时间' }] }
                            />
                            <div class={ cx('button-wrap') }>
                                <Button
                                    round={ true }
                                    block={ true }
                                    type="primary"
                                    loading={ loading.value }
                                    native-type="submit"
                                >
                                    提交
                                </Button>
                            </div>
                        </Form>
                    </div>
                    <TimePopup ref={ timeRef } v-model:value={ formData.except_arrive_time }/>
                </div>
            )
        }
    }
})
