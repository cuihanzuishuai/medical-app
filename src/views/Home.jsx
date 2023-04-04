import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    setup () {
        const router = useRouter()

        function handleClick () {
            router.push('/login')
        }

        return () => {
            return (
                <div onClick={ handleClick }>Home</div>
            )
        }
    }
})
