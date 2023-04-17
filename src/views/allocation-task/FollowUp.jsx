import { defineComponent, ref, reactive } from 'vue'
import { Popup, Form, showNotify, Field, Button } from 'vant'
import PickerPopup from '@/components/picker-popup'
import Loading from '@/components/loading'
import { requestCustomerServerResult } from '@/api/customer'
import { pxToVw } from '@/util/tools'
import classNames from '@/common/classNamesBind'
import styles from './style/follow-up.module.scss'

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

export default defineComponent({
    emits: ['finish'],
    setup (props, { emit, expose }) {
        const pickerRef = ref(null)

        const visible = ref(false)

        let recordData = null

        const formData = reactive({
            is_finished: '',
            desc: ''
        })

        function getEnumValue (text, enumData) {
            if (!text) return 0
            const list = Object.keys(enumData).map((key) => {
                return enumData[key]
            })
            const result = list.find((_) => _.text === text)
            return result ? result.value : 0
        }

        function onCustomerServerResult () {
            const data = {
                task_id: recordData.task_id,
                desc: formData.desc,
                is_finished: getEnumValue(formData.is_finished, FinishedEnum)
            }
            visible.value = false
            Loading()
            requestCustomerServerResult(data)
                .then((res) => {
                    showNotify({
                        type: 'primary',
                        message: '添加成功'
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
                    Loading.destroy()
                })
        }

        function onShowPickerPopup () {
            pickerRef.value && pickerRef.value.show()
        }

        function onReset () {
            Object.keys(formData).forEach((key) => {
                formData[key] = ''
            })
        }

        function show (record) {
            recordData = record
            onReset()
            visible.value = true
        }

        expose({
            show
        })

        return () => {
            const popupStyles = {
                height: pxToVw(536),
                width: '100%'
            }
            const columns = Object.keys(FinishedEnum).map((key) => {
                return FinishedEnum[key]
            })
            return (
                <Popup v-model:show={ visible.value } position="top" style={ popupStyles }>
                    <Form class={ cx('follow-up') } onSubmit={ onCustomerServerResult }>
                        <Field
                            label="是否完成"
                            placeholder="请选择"
                            v-model={ formData.is_finished }
                            readonly={ true }
                            isLink={ true }
                            onClick={ onShowPickerPopup }
                            rules={ [{ required: true, message: '请选择是否完成' }] }
                        />
                        <Field
                            label="备注"
                            placeholder="请输入"
                            type="textarea"
                            showWordLimit={ true }
                            rows="2"
                            maxlength="50"
                            v-model={ formData.desc }
                            rules={ [{ required: true, message: '请输入备注' }] }
                        />
                        <div className={ cx('button-wrap') }>
                            <Button
                                round={ true }
                                block={ true }
                                type="primary"
                                native-type="submit"
                            >
                                提交
                            </Button>
                        </div>
                        <PickerPopup ref={ pickerRef } columns={ columns } v-model:value={ formData.is_finished }/>
                    </Form>
                </Popup>
            )
        }
    }
})
