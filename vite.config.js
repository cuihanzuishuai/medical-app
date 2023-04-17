import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
    base: '/app/',
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    plugins: [
        vue(),
        vueJsx()
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import \'@/assets/css/mixin.scss\';'
            }
        }
    },
    build: {
        outDir: 'app'
    }
})
