const backcolor = () => {

    const getInfoApi = JSON.parse(sessionStorage.getItem('info'))
    if (getInfoApi !== undefined || getInfoApi !== null) {
        document.body.style.backgroundColor = getInfoApi[0].backcolor
    } else {
        document.body.style.backgroundColor = '#FFFFFF'
    }
}

export default backcolor;