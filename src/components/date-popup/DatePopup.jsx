import { defineComponent, ref } from 'vue'
import { PickerGroup, Popup, DatePicker } from 'vant'
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

        const time = dayjs().format('YYYY-MM-DD').split('-')

        const startDate = ref(time)
        const endDate = ref(time)

        function onConfirm () {
            const startTime = startDate.value.join('/')
            const endTime = endDate.value.join('/')
            const value = `${ startTime }~${ endTime }`
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
            const minDate = new Date(startDate.value.join('-'))

            return (
                <Popup v-model:show={ visible.value } position="bottom">
                    <PickerGroup
                        title="选择日期"
                        tabs={ ['开始日期', '结束日期'] }
                        nextStepText="下一步"
                        onConfirm={ onConfirm }
                        onCancel={ onCancel }
                    >
                        <DatePicker v-model={ startDate.value }/>
                        <DatePicker v-model={ endDate.value } minDate={ minDate }/>
                    </PickerGroup>
                </Popup>
            )
        }
    }
})
