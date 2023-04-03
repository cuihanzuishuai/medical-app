const targetsMap = new Map()

export function subscribe (key, func) {
  const depsMap = targetsMap.get(key)
  if (!depsMap) {
    targetsMap.set(key, [func])
  } else {
    depsMap.push(func)
    targetsMap.set(key, depsMap)
  }
}

export function publish (key, value) {
  const depsMap = targetsMap.get(key)
  if (!depsMap) {
    console.warn('"ObserverKey" is not defined')
  } else {
    depsMap.forEach((callback) => {
      callback(value)
    })
  }
}

export function unsubscribe (key, func) {
  const depsMap = targetsMap.get(key)
  if (depsMap) {
    if (func && depsMap.length > 0) {
      const index = depsMap.findIndex((item) => {
        return func === item
      })
      if (index === -1) {
        console.warn('"ObserverFunc" is not defined')
      } else {
        depsMap.splice(index, 1)
        if (depsMap.length) {
          targetsMap.set(key, depsMap)
        } else {
          targetsMap.delete(key)
        }
      }
    } else {
      targetsMap.delete(key)
    }
  }
}
