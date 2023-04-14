import { defineComponent, reactive, ref, onMounted, nextTick } from 'vue'
import { Button, Field, Icon, NavBar, SwipeCell, Space, Empty, showNotify, Tag } from 'vant'
import DatePopup from '@/components/date-popup'
import BetterScroll from '@/components/better-scroll'
import SearchPopup from '@/components/search-popup'
import PickerPopup from '@/components/picker-popup'
import Loading from '@/components/loading'
import { useRouter } from 'vue-router'
import { pxToVw } from '@/util/tools'
import { requestCustomerServerList, requestCustomerServerResult } from '@/api/customer'
import dayjs from 'dayjs'
import { formatCurrency } from '@/util/format'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

const FinishedEnum = {
    1: {
        value: 1,
        text: '已完成',
        color: 'blue'
    },
    2: {
        value: 2,
        text: '未完成',
        color: 'red'
    }
}

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
                    const finishedData = FinishedEnum[props.source.is_finished] || (props.source.is_finished ? FinishedEnum['1'] : FinishedEnum['2'])
                    return (
                        <div class={ cx('card-wrap') }>
                            <div class={ cx('card') }>
                                <div class={ cx('card-item') }>
                                    <Space size={ pxToVw(16) } align="center">
                                        <div class={ cx('title') }>{ props.source.customer_name }</div>
                                        <div>{ props.source.customer_mobile }</div>
                                    </Space>
                                    <Space size={ pxToVw(16) }>
                                        <Tag
                                            plain={ true }
                                            color={ finishedData.color }
                                            size="medium"
                                            type="primary"
                                        >
                                            { finishedData.text }
                                        </Tag>
                                    </Space>
                                </div>
                                <div class={ cx('card-item') }>
                                    <div class={ cx('subtitle') }>
                                        消费金额：{ formatCurrency(props.source.customer_amount / 100) }
                                    </div>
                                </div>
                                <div class={ cx('card-item') }>
                                    <div class={ cx('subtitle') } style={ flexStyles }>
                                        客服名称：{ props.source.name }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                },
                right: () => {
                    return <Button class={ cx('delete-button') } type="primary" square={ true }>回访</Button>
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
        const finishDateRef = ref(null)
        const distributeDateRef = ref(null)
        const pickerRef = ref(null)

        const dataSource = ref([])

        const formData = reactive({
            finish_time: '', // 完成时间
            distribute_time: '', // 分配时间
            is_finished: '', // 是否完成 0无 1 完成  2 未完成
            customer_mobile: '',  // 客户手机号
            name: '', // 员工姓名
            mobile: '' // 员工手机号
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

        function getStartAndEndTime (times) {
            const [startTime, endTime] = times ? times.split('~') : []
            return {
                startTime: startTime ? dayjs(startTime, 'YYYY/MM/DD').startOf('day').unix() : 0,
                endTime: endTime ? dayjs(endTime, 'YYYY/MM/DD').endOf('day').unix() : 0
            }
        }

        function getEnumValue (text, enumData) {
            if (!text) return 0
            const list = Object.keys(enumData).map((key) => {
                return enumData[key]
            })
            const result = list.find((_) => _.text === text)
            return result ? result.value : 0
        }

        function getDataSource () {
            const distributeTime = getStartAndEndTime(formData.distribute_time)
            const finishTime = getStartAndEndTime(formData.finish_time)
            const data = {
                name: formData.name,
                mobile: formData.mobile,
                customer_mobile: formData.customer_mobile,
                is_finished: getEnumValue(formData.is_finished, FinishedEnum),
                distribute_start_time: distributeTime.startTime,
                distribute_end_time: distributeTime.endTime,
                finish_start_time: finishTime.startTime,
                finish_end_time: finishTime.endTime,
                page: {
                    current_page: pagination.current,
                    page_size: pagination.pageSize
                }
            }
            Loading()
            return new Promise((resolve, reject) => {
                requestCustomerServerList(data)
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

        function onShowFinishDatePopup () {
            finishDateRef.value && finishDateRef.value.show()
        }

        function onShowDistributeDatePopup () {
            distributeDateRef.value && distributeDateRef.value.show()
        }

        function onShowPickerPopup () {
            pickerRef.value && pickerRef.value.show()
        }

        return () => {
            const navBarSlots = {
                right: () => <Icon name="search" size={ pxToVw(36) }/>
            }
            const columns = Object.keys(FinishedEnum).map((key) => {
                return FinishedEnum[key]
            })
            return (
                <div class={ cx('view-wrap', 'wrap-flex') }>
                    <NavBar
                        title="回访记录"
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
                            label="完成时间"
                            placeholder="请选择"
                            v-model={ formData.finish_time }
                            readonly={ true }
                            isLink={ true }
                            onClick={ onShowFinishDatePopup }
                        />
                        <Field
                            label="分配时间"
                            placeholder="请选择"
                            v-model={ formData.distribute_time }
                            readonly={ true }
                            isLink={ true }
                            onClick={ onShowDistributeDatePopup }
                        />
                        <Field
                            label="是否完成"
                            placeholder="请选择"
                            v-model={ formData.is_finished }
                            readonly={ true }
                            isLink={ true }
                            onClick={ onShowPickerPopup }
                        />
                        <Field
                            label="客户手机号"
                            placeholder="请输入"
                            v-model={ formData.customer_mobile }
                        />
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
                    <DatePopup ref={ finishDateRef } v-model:value={ formData.finish_time }/>
                    <DatePopup ref={ distributeDateRef } v-model:value={ formData.distribute_time }/>
                    <PickerPopup ref={ pickerRef } columns={ columns } v-model:value={ formData.is_finished }/>
                </div>
            )
        }
    }
})
