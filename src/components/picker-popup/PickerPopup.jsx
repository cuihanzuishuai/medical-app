import { defineComponent, ref } from 'vue'
import { Popup, Picker } from 'vant'

export default defineComponent({
    props: {
        columns: {
            type: Array,
            default: () => ([])
        },
        value: {
            type: String,
            default: ''
        }
    },
    emits: ['update:value', 'confirm', 'cancel'],
    setup (props, { emit, expose }) {
        const visible = ref(false)

        function onConfirm ({ selectedOptions }) {
            const [option] = selectedOptions
            emit('update:value', option.text)
            emit('confirm', option.text)
            visible.value = false
        }

        function onCancel () {
            visible.value = false
        }

        function show () {
            emit('cancel')
            visible.value = true
        }

        expose({
            show
        })

        return () => {
            return (
                <Popup v-model:show={ visible.value } position="bottom">
                    <Picker
                        columns={ props.columns }
                        onCancel={ onCancel }
                        onConfirm={ onConfirm }
                    />
                </Popup>
            )
        }
    }
})
