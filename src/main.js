import { createApp } from 'vue'
import Root from '@/App'
import router from '@/router'
import pinia from '@/store'
// -- css
import 'vant/lib/index.css'
import '@/assets/css/base.css'
import '@/assets/css/transition.scss'

const app = createApp(Root)
app.use(router)
app.use(pinia)

app.mount('#app')
