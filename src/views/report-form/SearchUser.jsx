import { defineComponent, ref } from 'vue'
import { Popup, Search, Empty, Loading, Cell, showNotify } from 'vant'
import { pxToVw } from '@/util/tools'
import { debounce } from 'lodash-es'
import { requestCustomerServerDistribute } from '@/api/customer'
import { requestUserList } from '@/api/user'
import BaseLoading from '@/components/loading'
import classNames from '@/common/classNamesBind'
import styles from './style/search-user.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    emits: ['finish'],
    setup (props, { emit, expose }) {
        const visible = ref(false)
        const searchValue = ref('')

        const searching = ref(false)
        const options = ref([])

        let reportIds = null

        const onSearch = debounce(function onSearch (value) {
            if (!value) return
            const data = {
                name: value,
                page: {
                    current_page: 1,
                    page_size: 10
                }
            }
            searching.value = true
            requestUserList(data)
                .then((res) => {
                    options.value = res.list.map((item) => {
                        return {
                            value: item.user_id,
                            label: `${ item.name }(${ item.mobile })`
                        }
                    })
                })
                .finally(() => {
                    searching.value = false
                })
        }, 300)

        function customerServerDistribute (option) {
            return function () {
                const data = {
                    user_id: option.value,
                    report_ids: [...reportIds]
                }
                visible.value = false
                BaseLoading()
                requestCustomerServerDistribute(data)
                    .then((res) => {
                        showNotify({
                            type: 'primary',
                            message: '分配成功'
                        })
                        emit('finish')
                    })
                    .catch((err) => {
                        showNotify({
                            type: 'warning',
                            message: err.message
                        })
                    })
                    .finally(() => {
                        BaseLoading.destroy()
                    })
            }
        }

        function show (selectedKeys) {
            reportIds = selectedKeys
            visible.value = true
        }

        expose({
            show
        })

        return () => {
            const popupStyles = {
                height: pxToVw(628),
                width: '100%'
            }

            const optionsList = () => {
                const cellSlots = {
                    'right-icon': () => null
                }
                return options.value.length !== 0 ? (
                    options.value.map((item) => {
                        return (
                            <Cell
                                title={ item.label }
                                isLink={ true }
                                onClick={ customerServerDistribute(item) }
                                v-slots={ cellSlots }
                            />
                        )
                    })
                ) : (
                    <Empty image="search" description="暂无数据"/>
                )
            }

            return (
                <Popup v-model:show={ visible.value } position="top" style={ popupStyles }>
                    <div class={ cx('search-wrap') }>
                        <Search placeholder="搜索员工姓名" v-model={ searchValue.value } onSearch={ onSearch }/>
                        <div class={ cx('search-list') }>
                            {
                                searching.value ? (
                                    <Loading class={ cx('loading') } size={ pxToVw(60) } type="spinner"/>
                                ) : (
                                    optionsList()
                                )
                            }
                        </div>
                    </div>
                </Popup>
            )
        }
    }
})
