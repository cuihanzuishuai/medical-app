import { hasOneOf } from '@/util/tools'
import useUserinfo from '@/store/userinfo'

function hasAccess (access) {
    const userinfo = useUserinfo()
    if (access && access.length) {
        return hasOneOf(userinfo.access, access)
    } else {
        return true
    }
}

export default hasAccess
