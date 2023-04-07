import { defineComponent, ref } from 'vue'
import { NavBar, Icon, Popup } from 'vant'
import BetterScroll from '@/components/better-scroll'
import { useRouter } from 'vue-router'
import { pxToVw } from '@/util/tools'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const router = useRouter()

        const visible = ref(false)

        function onClickLeft () {
            router.go(-1)
        }

        function onClickRight () {
            visible.value = true
        }

        return () => {
            const navBarSlots = {
                right: () => <Icon name="search" size={ pxToVw(36) }/>
            }

            const popupStyles = {
                width: pxToVw(600),
                height: '100%'
            }

            return (
                <div class={ cx('view-wrap') }>
                    <NavBar
                        title="报单登记"
                        leftArrow={ true }
                        onClickLeft={ onClickLeft }
                        onClickRight={ onClickRight }
                        v-slots={ navBarSlots }
                    />
                    <div className={ cx('scroll-wrap') }>
                        <BetterScroll>
                            搜索列表
                        </BetterScroll>
                    </div>
                    <Popup v-model:show={ visible.value } position="right" style={ popupStyles }>
                        搜索项
                    </Popup>
                </div>
            )
        }
    }
})
