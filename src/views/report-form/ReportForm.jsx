import { defineComponent, reactive, ref, onMounted, nextTick, computed } from 'vue'
import {
    Button,
    Field,
    Icon,
    NavBar,
    SwipeCell,
    Space,
    Empty,
    showNotify,
    Tag,
    Checkbox,
    showConfirmDialog
} from 'vant'
import DatePopup from '@/components/date-popup'
import BetterScroll from '@/components/better-scroll'
import SearchPopup from '@/components/search-popup'
import PickerPopup from '@/components/picker-popup'
import Loading from '@/components/loading'
import { useRouter } from 'vue-router'
import { pxToVw } from '@/util/tools'
import { requestReportList, requestReportRecover } from '@/api/report'
import dayjs from 'dayjs'
import hasAccess from '@/permission/hasAccess'
import * as Role from '@/permission'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

const MatchEnum = {
    1: {
        value: 1,
        text: '已匹配',
        color: 'blue'
    },
    2: {
        value: 2,
        text: '未匹配',
        color: 'red'
    }
}

const RelationTaskEnum = {
    1: {
        value: 1,
        text: '已分配',
        color: 'blue'
    },
    2: {
        value: 2,
        text: '未分配',
        color: 'red'
    }
}

const Card = defineComponent({
    props: {
        source: {
            type: Object,
            default: () => ({})
        },
        selectedKeys: {
            type: Array,
            default: () => ([])
        }
    },
    emits: ['update:selectedKeys', 'delete'],
    setup (props, { emit }) {
        const checked = computed(() => {
            return props.selectedKeys.indexOf(props.source.key) > -1
        })

        function formatTime (value) {
            const timeStr = String(value)
            if ((timeStr.length === 13)) {
                return dayjs(value).format('YYYY.MM.DD HH:mm')
            } else if (timeStr.length === 10) {
                return dayjs.unix(value).format('YYYY.MM.DD HH:mm')
            }
            return '--'
        }

        function onReportRecover () {
            const data = {
                id: props.source.id
            }
            Loading()
            requestReportRecover(data)
                .then(() => {
                    showNotify({
                        type: 'primary',
                        message: '撤销成功'
                    })
                    emit('delete')
                })
                .catch((err) => {
                    showNotify({
                        type: 'warning',
                        message: err.message
                    })
                })
                .finally(() => {
                    Loading.destroy()
                })
        }

        function onDelete () {
            showConfirmDialog({
                message: '确定要撤销？'
            })
                .then(() => {
                    onReportRecover()
                })
        }

        function onChange () {
            const index = props.selectedKeys.indexOf(props.source.key)
            const nextList = [...props.selectedKeys]
            if (index === -1) {
                nextList.push(props.source.key)
            } else {
                nextList.splice(index, 1)
            }
            emit('update:selectedKeys', nextList)
        }

        return () => {
            const hasPermission = hasAccess([Role.Admin, Role.RoleCustomManager])

            const swipeCellSlots = {
                default: () => {
                    const flexStyles = {
                        flex: 1
                    }
                    const matchData = MatchEnum[props.source.is_match] || (props.source.is_match ? MatchEnum['1'] : MatchEnum['2'])
                    const relationTaskData = RelationTaskEnum[props.source.relation_task] || (props.source.relation_task ? RelationTaskEnum['1'] : RelationTaskEnum['2'])
                    return (
                        <div class={ cx('card-wrap') }>
                            {
                                hasPermission ? (
                                    <div class={ cx('card-checkbox') }>
                                        <Checkbox checked={ checked.value } onClick={ onChange }/>
                                    </div>
                                ) : null
                            }
                            <div class={ cx('card') }>
                                <div class={ cx('card-item') }>
                                    <Space size={ pxToVw(16) } align="center">
                                        <div class={ cx('title') }>{ props.source.consumer_name }</div>
                                        <div>{ props.source.consumer_mobile }</div>
                                    </Space>
                                    <Space size={ pxToVw(16) }>
                                        <Tag
                                            plain={ true }
                                            color={ matchData.color }
                                            size="medium"
                                            type="primary"
                                        >
                                            { matchData.text }
                                        </Tag>
                                        {
                                            hasPermission ? (
                                                <Tag
                                                    plain={ true }
                                                    color={ relationTaskData.color }
                                                    size="medium"
                                                    type="primary">
                                                    { relationTaskData.text }
                                                </Tag>
                                            ) : null
                                        }
                                    </Space>
                                </div>
                                <div class={ cx('card-item') }>
                                    <div class={ cx('subtitle') }>
                                        预计到访时间：{ formatTime(props.source.except_arrive_time) }
                                    </div>
                                </div>
                                <div class={ cx('card-item') }>
                                    <div class={ cx('subtitle') } style={ flexStyles }>
                                        员工名称：{ props.source.user_name }
                                    </div>
                                    {
                                        hasPermission ? (
                                            <div class={ cx('subtitle') } style={ flexStyles }>
                                                客服名称：{ props.source.relation_task_username }
                                            </div>
                                        ) : null
                                    }
                                </div>
                            </div>
                        </div>
                    )
                },
                right: () => {
                    return (
                        <Button
                            class={ cx('delete-button') }
                            type="danger"
                            square={ true }
                            onClick={ onDelete }
                        >
                            撤销
                        </Button>
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
        const dateRef = ref(null)
        const pickerRef = ref(null)

        const dataSource = ref([])

        const formData = reactive({
            consumer_mobile: '', // 客户电话
            creat_time: '', // 报单开始时间 // 报单结束时间
            user_name: '', // 员工姓名
            user_id: '', // 员工ID
            is_match: '' // 是否匹配
        })

        const pagination = reactive({
            current: 1,
            pageSize: 10,
            total: 0
        })

        const selectedKeys = ref([])

        const checkAll = computed(() => {
            return selectedKeys.value.length === dataSource.value.length && dataSource.value.length !== 0

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
            const time = getStartAndEndTime(formData.creat_time)
            const data = {
                consumer_mobile: formData.consumer_mobile,
                create_start_time: time.startTime,// 报单开始时间
                creat_end_time: time.endTime, // 报单结束时间
                user_id: formData.user_id ? parseInt(formData.user_id) : 0,  // 员工id
                user_name: formData.user_name, // 员工姓名
                is_match: getEnumValue(formData.is_match, MatchEnum), // 是否匹配
                relation_task: hasAccess([Role.Admin, Role.RoleCustomManager]),
                page: {
                    current_page: pagination.current,
                    page_size: pagination.pageSize
                }
            }
            Loading()
            return new Promise((resolve, reject) => {
                requestReportList(data)
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
            selectedKeys.value = []
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

        function onShowDatePopup () {
            dateRef.value && dateRef.value.show()
        }

        function onShowPickerPopup () {
            pickerRef.value && pickerRef.value.show()
        }

        function handleCheckboxAll () {
            if (selectedKeys.value.length === dataSource.value.length) {
                selectedKeys.value = []
            } else {
                selectedKeys.value = dataSource.value.map((item) => {
                    return item.key
                })
            }
        }

        return () => {
            const navBarSlots = {
                right: () => <Icon name="search" size={ pxToVw(36) }/>
            }
            const hasPermission = hasAccess([Role.Admin, Role.RoleCustomManager])
            const columns = Object.keys(MatchEnum).map((key) => {
                return MatchEnum[key]
            })

            const checkboxClassNames = cx('checkbox-all', {
                'indeterminate': selectedKeys.value.length !== 0 && selectedKeys.value.length !== dataSource.value.length
            })
            return (
                <div class={ cx('view-wrap', 'wrap-flex') }>
                    <NavBar
                        title="报单列表"
                        leftArrow={ true }
                        onClickLeft={ onBackPrev }
                        onClickRight={ onShowSearchPopup }
                        v-slots={ navBarSlots }
                    />
                    {
                        hasPermission ? (
                            <div class={ cx('footer-bar') }>
                                <Checkbox
                                    class={ checkboxClassNames }
                                    shape="square"
                                    checked={ checkAll.value }
                                    disabled={ dataSource.value.length === 0 }
                                    onClick={ handleCheckboxAll }
                                >
                                    全选
                                </Checkbox>
                                <Button
                                    type="primary"
                                    size="small"
                                    disabled={ selectedKeys.value.length === 0 }
                                >
                                    分配
                                </Button>
                            </div>
                        ) : null
                    }
                    <div class={ cx('scroll-wrap') }>
                        <BetterScroll ref={ scrollRef } onDown={ onScrollDown } onUp={ onScrollUp }>
                            {
                                dataSource.value.length !== 0 ? (
                                    dataSource.value.map((item) => {
                                        return (
                                            <Card
                                                source={ item }
                                                v-model:selectedKeys={ selectedKeys.value }
                                                key={ item.key }
                                                onDelete={ onFinish }
                                            />
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
                            label="报单时间"
                            placeholder="请选择"
                            v-model={ formData.creat_time }
                            readonly={ true }
                            isLink={ true }
                            onClick={ onShowDatePopup }
                        />
                        <Field
                            label="是否匹配"
                            placeholder="请选择"
                            v-model={ formData.is_match }
                            readonly={ true }
                            isLink={ true }
                            onClick={ onShowPickerPopup }
                        />
                        <Field
                            label="客户电话"
                            placeholder="请输入"
                            v-model={ formData.consumer_mobile }
                        />
                        <Field
                            label="员工ID"
                            placeholder="请输入"
                            v-model={ formData.user_id }
                        />
                    </SearchPopup>
                    <DatePopup ref={ dateRef } v-model:value={ formData.creat_time }/>
                    <PickerPopup ref={ pickerRef } columns={ columns } v-model:value={ formData.is_match }/>
                </div>
            )
        }
    }
})
