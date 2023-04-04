import { defineStore } from 'pinia'
import { sessionCache } from '@/common/storage'
import { on } from '@/util/dom'

const HOME_PATH = '/'

sessionCache.set(HOME_PATH, '0')
const count = sessionCache.get('count')
let historyCount = count ? parseInt(count) : 0
let isTouchStart = false
let endTime = Date.now()

on(document, 'touchend', () => {
    isTouchStart = false
    endTime = Date.now()
})

on(document, 'touchstart', () => {
    isTouchStart = true
})

const useDirection = defineStore('direction', {
    state: () => {
        return {
            value: 'forward'
        }
    },
    actions: {
        updateDirection (toPath, fromPath, isPush) {
            const toIndex = sessionCache.get(toPath)
            const fromIndex = sessionCache.get(fromPath)
            let direction
            if (toIndex) {
                if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
                    direction = 'forward'
                } else {
                    direction = 'reverse'
                }
            } else {
                ++historyCount
                sessionCache.set('count', String(historyCount))
                toPath !== HOME_PATH && sessionCache.set(toPath, String(historyCount))
                direction = 'forward'
            }
            if (toIndex && toIndex !== '0' && !isPush && (((Date.now() - endTime) < 377) || isTouchStart)) {
                direction = undefined
            }
            this.$patch((state) => {
                state.value = direction
            })
            isTouchStart = false
        }
    }
})

export default useDirection
