import { defineComponent } from 'vue'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        return () => {
            return (
                <div>RegisterForm</div>
            )
        }
    }
})
