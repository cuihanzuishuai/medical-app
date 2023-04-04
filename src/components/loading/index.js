import { createVNode, render as vueRender } from 'vue'
import LoadingCom from './Loading'

const container = document.createElement('div')

function Loading () {
    const nextProps = {
        doClose: doClose
    }

    const vNode = createVNode(LoadingCom, nextProps)
    vueRender(vNode, container)
    document.body.appendChild(container)

    function destroy () {
        if (vNode && vNode.component) {
            const instance = vNode.component
            const vm = instance.proxy
            vm.onHide()
        }
    }

    function doClose () {
        vueRender(null, container)
        document.body.removeChild(container)
    }

    Loading.destroy = destroy

    return destroy
}

Loading.destroy = function () {
    document.body.removeChild(container)
}

export default Loading
