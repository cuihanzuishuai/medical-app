import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createStyleImportPlugin, VantResolve } from 'vite-plugin-style-import'

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    plugins: [
        vue(),
        vueJsx(),
        createStyleImportPlugin({
            resolves: [VantResolve()],
            libs: [{
                libraryName: 'vant',
                esModule: true,
                resolveStyle: (name) => {
                    return `vant/es/${ name }/style`
                }
            }]
        })
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import \'@/assets/css/mixin.scss\';'
            }
        }
    }
})
