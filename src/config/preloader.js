function imgPreloader (url) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = url
        image.onload = () => {
            resolve()
        }
        image.onerror = () => {
            reject()
        }
    })
}

function preloader (images) {
    const promiseArr = []
    images.forEach((element) => {
        promiseArr.push(imgPreloader(element))
    })
    return Promise.all(promiseArr)
}

export default preloader
