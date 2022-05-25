import api from '../../src/services/api';

const refreshData = async () => {
    const getInfoApi = JSON.parse(sessionStorage.getItem('info'))
    const companyTag = sessionStorage.getItem('tag')

    await api.get(`/empresa${companyTag}`).then(res => {
        if (res.data.company[0].tag === undefined) {
        } else {

            sessionStorage.setItem('info', JSON.stringify(res.data.company))
        }
    }).catch(error => {
        console.log({ error: "Error-getDataCompany" })
    })

    //categorias 
    await api.get(`/opcoes/categorias`).then(res => {
        if (res.data === undefined) {
        } else {

            sessionStorage.setItem('categDesc', JSON.stringify(res.data))
        }
    }).catch(error => {
        console.log({ error: "Error-getDataCateg" })
    })

    //modos de pagamento
    await api.get(`/opcoes/modospagamento`).then(res => {
        if (res.data === undefined) {
        } else {

            sessionStorage.setItem('payModes', JSON.stringify(res.data))
        }
    }).catch(error => {
        console.log({ error: "Error-getDataPayM" })
    })

    //produtos da empresa
    await api.get(`/produtos${companyTag}`).then(res => {
        if (res.data[0].length === 0) {
            sessionStorage.setItem('listProduct', JSON.stringify([]))
        } else {
            var list = res.data[0].products;
            sessionStorage.setItem('listProduct', JSON.stringify(list))

        }
    }).catch(error => {
        console.log({ error: "Error-getDataProd" })
    })

    const hoursWeek = [getInfoApi[0].funcdom, getInfoApi[0].funcseg, getInfoApi[0].functer, getInfoApi[0].funcqua, getInfoApi[0].funcqui, getInfoApi[0].funcsex, getInfoApi[0].funcsab]

    const dayWeek = new Date();
    const today = dayWeek.getDay();
    const hoursToday = hoursWeek[today]
    if (hoursToday === 'Fechado') {
        sessionStorage.setItem('ofp', 'false')
    } else {
        const date = new Date();
        const hr = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
        if (hoursToday.slice(0, 5) < hr && hoursToday.slice(6, 11) > hr) {
            sessionStorage.setItem('ofp', 'true')
        } else {
            sessionStorage.setItem('ofp', 'false')
        }
    }
}

export default refreshData;