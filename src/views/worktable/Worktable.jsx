import { defineComponent } from 'vue'
import { Cell } from 'vant'
import { useRouter } from 'vue-router'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const router = useRouter()

        function handleReportForm () {
            router.push({ name: 'report-form' })
        }

        function handleAllocationTask () {
            router.push({ name: 'allocation-task' })
        }

        return () => {
            return (
                <div>
                    <Cell title="报单登记" isLink={ true } icon="bar-chart-o" onClick={ handleReportForm }/>
                    <Cell title="回访记录" isLink={ true } icon="service-o" onClick={ handleAllocationTask }/>
                </div>
            )
        }
    }
})
