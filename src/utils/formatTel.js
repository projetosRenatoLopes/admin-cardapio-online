const formatTel = (tel) => {
    tel = tel.replace(/[A-Za-z]/,'');
    tel = tel.replace(/\D/g, '');
    tel = tel.replace(/[-]/, '');
    tel = tel.replace(/( )+/g, ' ');
    if(tel.length === 0){
        return("")
    } else if (tel.length === 1) {
        return(`(${tel}`)
    } else if (tel.length === 2) {
        return(`(${tel.slice(0, 2)}`)
    } else if (tel.length === 3) {
        return(`(${tel.slice(0, 2)}) ${tel.slice(2, 3)}`)
    } else if (tel.length === 4) {
        return(`(${tel.slice(0, 2)}) ${tel.slice(2, 4)}`)
    } else if (tel.length === 5) {
        return(`(${tel.slice(0, 2)}) ${tel.slice(2, 5)}`)
    } else if (tel.length === 6) {
        return(`(${tel.slice(0, 2)}) ${tel.slice(2, 6)}`)
    } else if (tel.length === 7) {
        return(`(${tel.slice(0, 2)}) ${tel.slice(2, 7)}`)
    } else if (tel.length === 8) {
        return(`(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7, 8)}`)
    } else if (tel.length === 9) {
        return(`(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7, 9)}`)
    } else if (tel.length === 10) {
        return(`(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7, 10)}`)
    } else if (tel.length === 11) {
        return(`(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7, 11)}`)
    } else if (tel.length > 11) {
        return(`(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7, 11)}`)
    } 
    // return tel
    //${tel.slice(2, 5)}-${tel.slice(7, 4)}
    // return tel
}

export default formatTel;