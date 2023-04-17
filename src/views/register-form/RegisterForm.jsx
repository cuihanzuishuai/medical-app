import { defineComponent, reactive, ref } from 'vue'
import { Field, Form, NavBar, showNotify } from 'vant'
import TimePopup from '@/components/time-popup'
import Loading from '@/components/loading'
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
            Loading()
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
                    Loading.destroy()
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
                        <Form onSubmit={ onCreateReport }>
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
                        </Form>
                    </div>
                    <TimePopup ref={ timeRef } v-model:value={ formData.except_arrive_time }/>
                </div>
            )
        }
    }
})
