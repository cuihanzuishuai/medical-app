import { defineComponent, ref, Transition } from 'vue'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    props: {
        doClose: Function
    },
    setup (props) {
        const spinning = ref(true)

        function doClose () {
            props.doClose && props.doClose()
        }

        function onHide () {
            spinning.value = false
        }

        function preventTouchMove () {

        }

        return {
            spinning,
            doClose,
            onHide,
            preventTouchMove
        }
    },
    render () {
        const { spinning } = this

        return (
            <Transition name="x-mask" appear={ true } onAfterLeave={ this.doClose }>
                <div class={ cx('loading') } v-show={ spinning } onTouchMove={ this.preventTouchMove }>
                    <div class={ cx('loading-container') }>
                        <div class={ cx('loading-container__outer') }/>
                        <div class={ cx('loading-container__inner') }/>
                    </div>
                </div>
            </Transition>
        )
    }
})
