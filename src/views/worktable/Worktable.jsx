import { defineComponent } from 'vue'
import { Cell, Icon } from 'vant'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        return () => {
            return (
                <div>
                    <Cell title="报单登记" isLink={ true } icon="bar-chart-o"/>
                    <Cell title="回访记录" isLink={ true } icon="service-o"/>
                </div>
            )
        }
    }
})
