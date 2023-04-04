import { defineComponent, Transition } from 'vue'
import { RouterView } from 'vue-router'
import useDirection from '@/store/direction'
import classNames from '@/common/classNames'
import { NO } from '@/util'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export default defineComponent({
    setup () {
        const direction = useDirection()

        let innerHeight = window.innerHeight
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            console.log(direction.value)
            window.addEventListener('focusout', () => {
                window.scroll(0, 0)
            })
        } else if (/(Android)/i.test(navigator.userAgent)) {
            window.addEventListener('resize', () => {
                let newInnerHeight = window.innerHeight
                if (innerHeight <= newInnerHeight) {
                    window.scroll(0, 0)
                }
            })
        }

        return () => {
            const routerViewSlots = {
                default: (scope) => {
                    return (
                        <Transition name={ direction.value } appear={ true }>
                            { scope.Component }
                        </Transition>
                    )
                }
            }
            return (
                <div class={ classNames('load-bear-app') } onClick={ NO }>
                    <RouterView v-slots={ routerViewSlots }/>
                </div>
            )
        }
    }
})
