import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import { createStyleImportPlugin, VantResolve } from 'vite-plugin-style-import'

// createStyleImportPlugin({
//     resolves: [VantResolve()],
//     libs: [{
//         libraryName: 'vant',
//         esModule: true,
//         ensureStyleFile: true, // 检查是否存在样式文件
//         resolveStyle: (name) => {
//             return `../es/${ name }/style`
//         }
//     }]
// })

export default defineConfig({
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
    }
})
