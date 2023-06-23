import { defineComponent, ref } from 'vue'
import { Popup, DatePicker } from 'vant'
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
        const date = ref(dayjs().format('YYYY-MM-DD').split('-'))

        function onConfirm () {
            emit('update:value', date)
            emit('confirm', date)
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
                <Popup v-model:show={ visible.value } position="bottom" close-on-click-overlay={false}>
                    <DatePicker v-model={ date.value } onConfirm={ onConfirm } onCancel={ onCancel }/>
                </Popup>
            )
        }
    }
})
