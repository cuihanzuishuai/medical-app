import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import BetterScroll from '@/components/better-scroll'

export default defineComponent({
    setup () {
        const router = useRouter()

        function handleClick () {
            router.push('/login')
        }

        return () => {
            return (
                <div style={ { width: '100%', height: '100%' } }>
                    <BetterScroll></BetterScroll>
                </div>
            )
        }
    }
})
