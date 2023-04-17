import { defineComponent, ref } from 'vue'
import { PickerGroup, Popup, DatePicker, TimePicker } from 'vant'
import dayjs from 'dayjs'

export default defineComponent({
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    emits: ['update:value', 'confirm', 'cancel'],
    setup (props, { emit, expose }) {
        const visible = ref(false)

        const nowDate = dayjs().format('YYYY-MM-DD').split('-')
        const nowTime = dayjs().format('HH:mm').split(':')

        const currentDate = ref(nowDate)
        const currentTime = ref(nowTime)

        function onConfirm () {
            const date = currentDate.value.join('/')
            const time = currentTime.value.join(':')
            const value = `${ date } ${ time }`
            emit('update:value', value)
            emit('confirm', value)
            visible.value = false
        }

        function onCancel () {
            emit('cancel')
            visible.value = false
        }

        function show () {
            visible.value = true
        }

        expose({
            show
        })

        return () => {
            return (
                <Popup v-model:show={ visible.value } position="bottom">
                    <PickerGroup
                        title="选择时间"
                        tabs={ ['选择日期', '选择时间'] }
                        nextStepText="下一步"
                        onConfirm={ onConfirm }
                        onCancel={ onCancel }
                    >
                        <DatePicker v-model={ currentDate.value }/>
                        <TimePicker v-model={ currentTime.value }/>
                    </PickerGroup>
                </Popup>
            )
        }
    }
})
