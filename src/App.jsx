import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export default defineComponent({
  setup () {
    return () => {
      return (
          <RouterView/>
      )
    }
  }
})
