export function stopPropagation (event) {
    event.stopPropagation()
}

export function preventDefault (event, isStopPropagation) {
    if (typeof event.cancelable !== 'boolean' || event.cancelable) {
        event.preventDefault()
    }
    if (isStopPropagation) {
        stopPropagation(event)
    }
}

export function trigger (target, type) {
    const inputEvent = document.createEvent('HTMLEvents')
    inputEvent.initEvent(type, true, true)
    target.dispatchEvent(inputEvent)
}

export function isNotTouchEvent (evt) {
    const evtType = evt.type.toLowerCase()
    return evt.touches.length > 1 || (evtType === 'touchend' && evt.touches.length > 0)
}
