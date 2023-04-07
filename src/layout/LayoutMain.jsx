import { defineComponent, ref } from 'vue'
import { Tabbar, TabbarItem } from 'vant'
import { RouterView, useRoute, useRouter } from 'vue-router'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const router = useRouter()
        const route = useRoute()

        const active = ref(route.name)

        function onChange (value) {
            router.replace({ name: value })
        }

        return () => {
            return (
                <div class={ cx('view-wrap', 'layout-main') }>
                    <div class={ cx('layout-content') }>
                        <div class={ cx('content-space') }>
                            <RouterView/>
                        </div>
                    </div>
                    <div class={ cx('layout-footer') }>
                        <Tabbar fixed={ false } v-model={ active.value } onChange={ onChange }>
                            <TabbarItem name="worktable" icon="home-o">工作台</TabbarItem>
                            <TabbarItem name="user" icon="user-o">我的</TabbarItem>
                        </Tabbar>
                    </div>
                </div>
            )
        }
    }
})
