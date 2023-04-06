import { defineComponent, ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue'
import BScroll from '@better-scroll/core'
import BPullDown from '@better-scroll/pull-down'
import BPullUp from '@better-scroll/pull-up'
import BScrollBar from '@better-scroll/scroll-bar'
import { Icon, Loading, Space } from 'vant'
import { isFunction } from '@/util'
import { pxToVw } from '@/util/tools'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

BScroll.use(BPullDown)
BScroll.use(BPullUp)
BScroll.use(BScrollBar)

const DownStatus = {
    // 下拉刷新
    READYING: 'readying',
    // 释放刷新
    PENDING: 'pending',
    // 加载中...
    LOADING: 'loading',
    // 刷新成功
    FULFILLED: 'fulfilled',
    // 刷新失败
    REJECTED: 'rejected'
}
const UpStatus = {
    // 上拉加载
    READYING: 'readying',
    // 加载中...
    LOADING: 'loading',
    // 加载失败请重试
    REJECTED: 'rejected'
}

const cx = classNames.bind(styles)

export default defineComponent({
    props: {
        onDown: {
            type: Function
        },
        onUp: {
            type: Function
        },
        background: {
            type: String,
            default: '#FFFFFF'
        }
    },
    setup (props, { slots, expose }) {
        const scrollRef = ref(null)
        const scrollCall = ref(null)

        const headRef = ref(null)
        const footRef = ref(null)

        // 首次。。。
        const isFirstTime = ref(true)

        const scrollStatus = reactive({
            downState: DownStatus.READYING,
            upState: UpStatus.READYING,
            surplus: false, // 剩余 是否有下一页
            openPullUp: false, // 上拉能否使用
            pullUpLoad: false // 上拉是否装载
        })

        onMounted(() => {
            initScroll()
        })

        function initScroll () {
            if (!scrollCall.value) {
                const options = {
                    click: true,
                    eventPassthrough: 'horizontal',
                    pullUpLoad: true,
                    pullDownRefresh: true,
                    scrollbar: true
                }
                scrollCall.value = new BScroll(scrollRef.value, options)
                initScrollDown()
                initScrollUp()
            } else {
                onRefresh()
            }
        }

        function initScrollDown () {
            if (isFunction(props.onDown)) {
                const stop = headRef.value.offsetHeight
                const threshold = Math.round((15 / 11) * stop)
                scrollCall.value.openPullDown({ threshold: threshold, stop: stop })
                scrollCall.value.on('pullingDown', onPullingDown)
                scrollCall.value.on('leaveThreshold', onLeaveThreshold)
                scrollCall.value.on('enterThreshold', onEnterThreshold)
            }
        }

        function initScrollUp () {
            if (isFunction(props.onUp)) {
                onOpenPullUp()
                scrollCall.value.on('pullingUp', onPullingUp)
            }
        }

        function onLeaveThreshold () {
            if (scrollStatus.downState === DownStatus.READYING) {
                scrollStatus.downState = DownStatus.PENDING
            }
        }

        function onEnterThreshold () {
            if (scrollStatus.downState === DownStatus.FULFILLED || scrollStatus.downState === DownStatus.REJECTED) {
                scrollStatus.downState = DownStatus.READYING
                if (isFirstTime.value) isFirstTime.value = false
            } else if (scrollStatus.downState === DownStatus.PENDING) {
                scrollStatus.downState = DownStatus.READYING
            }
        }

        function onOpenPullUp () {
            if (isFunction(props.onUp) && !scrollStatus.openPullUp) {
                scrollStatus.openPullUp = true
                scrollStatus.pullUpLoad = true
                const stop = footRef.value.offsetHeight
                const threshold = Math.round(-(5 / 11) * stop)
                scrollCall.value.openPullUp({ threshold: threshold })
            }
        }

        function onClosePullUp () {
            if (isFunction(props.onUp) && scrollStatus.openPullUp) {
                scrollStatus.openPullUp = false
                scrollStatus.pullUpLoad = false
                scrollCall.value.closePullUp()
            }
        }

        function onPullDownLoad (action) {
            if (isFunction(props.onDown)) {
                action && scrollCall.value.finishPullDown()
            }
        }

        function onPullUpLoad (action) {
            if (isFunction(props.onUp) && scrollStatus.openPullUp && !scrollStatus.pullUpLoad) {
                action && scrollCall.value.finishPullUp()
            }
        }

        function onPullingDown () {
            scrollStatus.downState = DownStatus.LOADING

            function onFulfilled (result) {
                scrollStatus.surplus = result
                scrollStatus.downState = DownStatus.FULFILLED
                result ? onOpenPullUp() : onClosePullUp()
                onPullUpLoad(result)
                onFinally()
            }

            function onRejected (err) {
                scrollStatus.downState = DownStatus.REJECTED
                onClosePullUp()
                onFinally()
            }

            function onFinally () {
                !isFirstTime.value && scrollCall.value.disable()
                setTimeout(() => {
                    onPullDownLoad(true)
                    scrollCall.value.enable()
                    onRefresh()
                }, 600)
            }

            props.onDown(onFulfilled, onRejected)
        }

        function onPullingUp () {
            scrollStatus.pullUpLoad = false
            scrollStatus.upState = UpStatus.LOADING

            function onFulfilled (result) {
                scrollStatus.surplus = result
                scrollStatus.upState = UpStatus.READYING
                onPullUpLoad(result)
                onFinally()
            }

            function onRejected (err) {
                scrollStatus.upState = UpStatus.REJECTED
                onPullUpLoad(true)
                onFinally()
            }

            function onFinally () {
                onRefresh()
            }

            props.onUp(onFulfilled, onRejected)
        }

        function onRefresh () {
            nextTick(() => {
                scrollCall.value && scrollCall.value.refresh()
            })
        }

        onBeforeUnmount(() => {
            scrollCall.value && scrollCall.value.destroy()
        })

        function onResetScroll (action) {
            isFirstTime.value = true
            scrollStatus.downState = DownStatus.READYING
            scrollStatus.upState = UpStatus.READYING
            if (action && scrollCall.value && isFunction(props.onDown)) {
                scrollCall.value.disable()
                scrollCall.value.autoPullDownRefresh()
            }

        }

        expose({
            onResetScroll
        })

        return () => {
            const ScrollHead = (
                <div class={ cx('scroll-head') } ref={ headRef }>
                    { scrollStatus.downState === DownStatus.READYING ? (
                        <div class={ cx('state-wrap') }>
                            <Space size={ pxToVw(6) }>
                                <Icon size={ pxToVw(40) } color="#666666" name="down"/>
                                <div class={ cx('state-text') }>下拉刷新</div>
                            </Space>
                        </div>
                    ) : null }
                    { scrollStatus.downState === DownStatus.PENDING ? (
                        <div class={ cx('state-wrap') }>
                            <Space size={ pxToVw(6) }>
                                <Icon class={ cx('state-icon__up') } size={ pxToVw(40) } color="#666666" name="down"/>
                                <div class={ cx('state-text') }>释放刷新</div>
                            </Space>
                        </div>
                    ) : null }
                    { scrollStatus.downState === DownStatus.LOADING ? (
                        <div class={ cx('state-wrap') }>
                            <Space size={ pxToVw(6) }>
                                <Loading size={ pxToVw(40) } color="#666666"/>
                                <div class={ cx('state-text') }>加载中...</div>
                            </Space>
                        </div>
                    ) : null }
                    { scrollStatus.downState === DownStatus.FULFILLED ? (
                        <div class={ cx('state-wrap') }>
                            <Space size={ pxToVw(6) }>
                                <div class={ cx('state-text') }>{ isFirstTime.value ? '加载成功' : '刷新成功' }</div>
                            </Space>
                        </div>
                    ) : null }
                    { scrollStatus.downState === DownStatus.REJECTED ? (
                        <div class={ cx('state-wrap') }>
                            <Space size={ pxToVw(6) }>
                                <div class={ cx('state-text') }>{ isFirstTime.value ? '加载失败' : '刷新失败' }</div>
                            </Space>
                        </div>
                    ) : null }
                </div>
            )

            const ScrollFoot = (
                <div class={ cx('scroll-foot') } ref={ footRef }>
                    { scrollStatus.upState === UpStatus.READYING ? (
                        <div class={ cx('state-wrap') }>
                            <Space size={ pxToVw(6) }>
                                <div class={ cx('state-text') }>{ scrollStatus.surplus ? '上拉加载' : '没有更多了' }</div>
                            </Space>
                        </div>
                    ) : null }
                    { scrollStatus.upState === UpStatus.LOADING ? (
                        <div class={ cx('state-wrap') }>
                            <Space size={ pxToVw(6) }>
                                <Loading size={ pxToVw(40) } color="#666666"/>
                                <div class={ cx('state-text') }>加载中...</div>
                            </Space>
                        </div>
                    ) : null }
                    { scrollStatus.upState === UpStatus.REJECTED ? (
                        <div class={ cx('state-wrap') }>
                            <Space size={ pxToVw(6) }>
                                <div class={ cx('state-text') }>加载失败请重试</div>
                            </Space>
                        </div>
                    ) : null }
                </div>
            )

            return (
                <div class={ cx('scroll-wrap') }>
                    <div class={ cx('scroll-call') } ref={ scrollRef }>
                        <div class={ cx('scroll-view') } style={ { background: props.background } }>
                            { ScrollHead }
                            { slots.default ? slots.default() : null }
                            { ScrollFoot }
                        </div>
                    </div>
                </div>
            )
        }
    }
})
