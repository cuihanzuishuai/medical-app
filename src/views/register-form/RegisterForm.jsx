import { defineComponent, reactive, ref, onMounted, nextTick } from 'vue'
import { Field, Icon, NavBar, SwipeCell, Space, Empty, showNotify } from 'vant'
import Loading from '@/components/loading'
import { useRouter } from 'vue-router'
import { requestStatisticsCustomer } from '@/api/statistics'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const router = useRouter()

        const formData = reactive({
            mobile: '', // 员工手机号
            name: '' // 员工姓名
        })

        function onBackPrev () {
            router.go(-1)
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
                        <Field
                            label="客户姓名"
                            placeholder="请输入"
                            v-model={ formData.name }
                        />
                        <Field
                            label="客户电话"
                            placeholder="请输入"
                            v-model={ formData.mobile }
                        />
                        <Field
                            label="预期到访时间"
                            placeholder="请选择"
                            readonly={ true }
                            isLink={ true }
                        />
                    </div>
                </div>
            )
        }
    }
})
