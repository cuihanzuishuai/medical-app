import { defineComponent } from 'vue'
import classNames from '@/common/classNamesBind'
import styles from './style/search-user.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        return () => {
            return (
                <div>SearchUser</div>
            )
        }
    }
})
