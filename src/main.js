import { createApp } from 'vue'
import Root from '@/App'
import router from '@/router'
import pinia from '@/store'
// -- images
import preloader from '@/config/preloader'
import preloaderList from '@/config/preloaderList'
// -- css
import 'vant/lib/index.css'
import '@/assets/css/base.css'
import '@/assets/css/transition.scss'
// -- icon
import '@/assets/icon/index.css'

const app = createApp(Root)
app.use(router)
app.use(pinia)


void async function () {
    await preloader(preloaderList)
    app.mount('#app')
}()
