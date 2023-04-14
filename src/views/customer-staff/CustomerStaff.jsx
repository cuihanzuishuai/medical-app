import { defineComponent, reactive, ref, onMounted, nextTick } from 'vue'
import { Field, Icon, NavBar, SwipeCell, Space, Empty, showNotify } from 'vant'
import BetterScroll from '@/components/better-scroll'
import SearchPopup from '@/components/search-popup'
import Loading from '@/components/loading'
import { useRouter } from 'vue-router'
import { pxToVw } from '@/util/tools'
import { requestStatisticsCustomer } from '@/api/statistics'
import dayjs from 'dayjs'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

const Card = defineComponent({
    props: {
        source: {
            type: Object,
            default: () => ({})
        }
    },
    setup (props, { emit }) {
        function formatTime (value) {
            const timeStr = String(value)
            if ((timeStr.length === 13)) {
                return dayjs(value).format('YYYY.MM.DD HH:mm')
            } else if (timeStr.length === 10) {
                return dayjs.unix(value).format('YYYY.MM.DD HH:mm')
            }
            return '--'
        }

        return () => {
            const swipeCellSlots = {
                default: () => {
                    const flexStyles = {
                        flex: 1
                    }
                    return (
                        <div class={ cx('card-wrap') }>
                            <div class={ cx('card') }>
                                <div class={ cx('card-item') }>
                                    <Space size={ pxToVw(16) } align="center">
                                        <div class={ cx('title') }>{ props.source.user_name }</div>
                                        <div>{ props.source.user_mobile }</div>
                                    </Space>
                                </div>
                                <div class={ cx('card-item') }>
                                    <div class={ cx('subtitle') } style={ flexStyles }>
                                        总任务数：{ props.source.total_num }
                                    </div>
                                    <div class={ cx('subtitle') } style={ flexStyles }>
                                        完成任务数：{ props.source.finish_num }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            }
            return <SwipeCell v-slots={ swipeCellSlots }/>
        }
    }
})

export default defineComponent({
    setup () {
        const router = useRouter()
        const scrollRef = ref(null)
        const searchRef = ref(null)

        const dataSource = ref([])

        const formData = reactive({
            mobile: '', // 员工手机号
            name: '' // 员工姓名
        })

        const pagination = reactive({
            current: 1,
            pageSize: 10,
            total: 0
        })

        onMounted(() => {
            nextTick(() => {
                onFinish()
            })
        })

        function getDataSource () {
            const data = {
                mobile: formData.mobile,
                name: formData.name,
                page: {
                    current_page: pagination.current,
                    page_size: pagination.pageSize
                }
            }
            Loading()
            return new Promise((resolve, reject) => {
                requestStatisticsCustomer(data)
                    .then((res) => {
                        const dataList = res.list.map((item) => {
                            return {
                                key: item.id,
                                ...item
                            }
                        })
                        if (pagination.current === 1) {
                            pagination.total = res.page.total
                        }
                        resolve(dataList)
                    })
                    .catch((err) => {
                        showNotify({
                            type: 'warning',
                            message: err.message
                        })
                        reject(err)
                    })
                    .finally(() => {
                        Loading.destroy()
                    })
            })
        }

        function hasTotal () {
            const { current, pageSize, total } = pagination
            if (total === 0) return true
            return current * pageSize < total
        }

        function onScrollDown (resolve, reject) {
            pagination.current = 1
            pagination.total = 0
            getDataSource()
                .then((list) => {
                    dataSource.value = [...list]
                    resolve(hasTotal)
                })
                .catch((err) => {
                    reject(err)
                })
        }

        function onScrollUp (resolve, reject) {
            pagination.current += 1
            getDataSource()
                .then((list) => {
                    dataSource.value = [...dataSource.value, ...list]
                    resolve(hasTotal)
                })
                .catch((err) => {
                    reject(err)
                })
        }

        function onFinish () {
            scrollRef.value && scrollRef.value.onResetScroll(true)
        }

        function onReset () {
            Object.keys(formData).forEach((key) => {
                formData[key] = ''
            })
        }

        function onBackPrev () {
            router.go(-1)
        }

        function onShowSearchPopup () {
            searchRef.value && searchRef.value.show()
        }

        return () => {
            const navBarSlots = {
                right: () => <Icon name="search" size={ pxToVw(36) }/>
            }
            return (
                <div class={ cx('view-wrap', 'wrap-flex') }>
                    <NavBar
                        title="客服部工作量"
                        leftArrow={ true }
                        onClickLeft={ onBackPrev }
                        onClickRight={ onShowSearchPopup }
                        v-slots={ navBarSlots }
                    />
                    <div class={ cx('scroll-wrap') }>
                        <BetterScroll ref={ scrollRef } onDown={ onScrollDown } onUp={ onScrollUp }>
                            {
                                dataSource.value.length !== 0 ? (
                                    dataSource.value.map((item) => {
                                        return (
                                            <Card source={ item } key={ item.key }/>
                                        )
                                    })
                                ) : (
                                    <Empty image="search" description="暂无数据"/>
                                )
                            }
                        </BetterScroll>
                    </div>
                    <SearchPopup ref={ searchRef } onFinish={ onFinish } onReset={ onReset }>
                        <Field
                            label="员工姓名"
                            placeholder="请输入"
                            v-model={ formData.name }
                        />
                        <Field
                            label="员工手机号"
                            placeholder="请输入"
                            v-model={ formData.mobile }
                        />
                    </SearchPopup>
                </div>
            )
        }
    }
})
