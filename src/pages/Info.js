
import Menu from '../components/Menu/menu'
import OptionsCateg from '../components/OptionsCateg'
import OptionsPayModes from '../components/OptionsPayModes'
import formatTel from '../utils/formatTel'
import api from "../services/api.js";


const Info = () => {
    const companyTag = sessionStorage.getItem('tag')
    const token = localStorage.getItem(`${companyTag}-token`)
    if (token === null || token === undefined) {
        window.location.href = `${companyTag}/login`
    }

    const data = JSON.parse(sessionStorage.getItem('info'))
    var telFormated = `(${data[0].tel.slice(2, 4)}) ${data[0].tel.slice(4, 9)}-${data[0].tel.slice(9, 13)}`


    const verifyTel = () => {
        const tel = document.getElementById('ad-wha')['value']
        document.getElementById('ad-wha')['value'] = formatTel(tel)
    }

    const verifyTaxa = () => {
        var tx = document.getElementById('ad-tax')['value']
        tx = tx.replace(/[A-Za-z]/, '');
        tx = tx.replace(/\D/g, '');
        var newTx;
        if (tx.length === 0) {
            newTx = ""
        } else if (tx.length === 1) {
            newTx = tx
        } else if (tx.length === 2) {
            newTx = `${tx.slice(0, 1)},${tx.slice(1, 2)}`
        } else if (tx.length === 3) {
            newTx = `${tx.slice(0, 1)},${tx.slice(1, 3)}`
        } else {
            newTx = `${tx.slice(0, 2)},${tx.slice(2, 4)}`
        }
        document.getElementById('ad-tax')['value'] = ("R$ " + newTx)
    }

    function veriFyChecks(obj) {
        let categsServer = [];
        obj.forEach(element => {
            var checkek = document.getElementById(element.desc);
            // @ts-ignore
            if (checkek.checked === true) {
                categsServer.push(checkek['value']);
            }
        });
        return categsServer.join(',');

    }

    const colorMsg = (color, msg) => {
        document.getElementById('ad-resposta')['value'] = `${msg}`
        document.getElementById('ad-resposta').style.boxShadow = `0 -1px 0 ${color}, 0 0 2px ${color}, 0 2px 4px ${color}`
    }

    const updateInfo = async () => {
        colorMsg('yellow', 'Aguardando resposta...')
        document.getElementById('btn-cad')['disabled'] = true
        const nameEmp = document.getElementById('ad-name')['value'],
            tagEmp = document.getElementById('ad-tag')['value'],
            rua = document.getElementById('ad-rua')['value'],
            num = document.getElementById('ad-num')['value'],
            com = document.getElementById('ad-com')['value'],
            bai = document.getElementById('ad-bai')['value'],
            cid = document.getElementById('ad-cid')['value'],
            est = document.getElementById('ad-est')['value'],
            entrega = document.getElementById('ad-tax')['value'],
            logoEmp = document.getElementById('ad-logo')['value'],
            telEmp = document.getElementById('ad-wha')['value'],
            colorBack = document.getElementById('ad-color')['value'];
        var newTel = telEmp.replace(/[A-Za-z]/, '');
        newTel = newTel.replace(/\D/g, '');
        newTel = newTel.replace(/[-]/, '');
        newTel = newTel.replace(/( )+/g, '');
        newTel = newTel.replace(/[()]+/g, '');
        newTel = newTel.replace(/( )+/g, '');
        newTel = `55${newTel}`;
        var newTx = entrega.replace(/[A-Za-z]/, '').replace(/[$]/, '').replace(/[,]/, '.').replace(/( )+/g, '');
        const arrCateg = JSON.parse(sessionStorage.getItem('categ'));
        const arrCategs = veriFyChecks(arrCateg)
        const arrPayMode = JSON.parse(sessionStorage.getItem('payModes'))
        const arrPayModes = veriFyChecks(arrPayMode)

        const data = JSON.parse(sessionStorage.getItem('info'))
        const dadosEmpresa = {
            "empadrbai": bai,
            "empadrcid": cid,
            "empadrcom": com,
            "empadrest": est,
            "empadrnum": num,
            "empadrrua": rua,
            "empcategs": arrCategs,
            "empfuncdom": data[0].funcdom,
            "empfuncqua": data[0].funcqua,
            "empfuncqui": data[0].funcqui,
            "empfuncsab": data[0].funcsab,
            "empfuncseg": data[0].funcseg,
            "empfuncsex": data[0].funcsex,
            "empfuncter": data[0].functer,
            "emplogo": logoEmp,
            "empname": nameEmp,
            "emppaymodes": arrPayModes,
            "emptag": tagEmp,
            "emptel": newTel,
            "emptxentrega": newTx,
            "backcolor": colorBack
        }
        console.log(dadosEmpresa)

        let verifyProp = true;
        Object.entries(dadosEmpresa).forEach(([key, value]) => {
            if (value === "") {
                verifyProp = false
            }
        });
        if (verifyProp === true) {
            colorMsg('blue', 'Aguardando resposta do servidor >')
            if ((!isNaN(parseFloat(data[0].tel)) && isFinite(data[0].tel)) === true && data[0].tel.length === 13) {
                const regex = /\W|_/;
                if (regex.test(data[0].tag) === false) {
                    if (!isNaN(parseFloat(data[0].txentrega)) && isFinite(data[0].txentrega)) {
                        const token = localStorage.getItem(`${companyTag}-token`)
                        if (token !== undefined) {
                            if (data[0].categs !== "") {
                                if (data[0].paymodes !== "") {

                                    var resposta;
                                    await api({
                                        method: 'PUT',
                                        url: `/empresa/${data[0].tag}`,
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: token
                                        },
                                        data: dadosEmpresa
                                    })
                                        .then(resp => {
                                            resposta = resp.data;
                                            colorMsg('GREEN', resposta.message)

                                            api.get(`/empresa/${data[0].tag}`).then(res => {
                                                if (res.data.company[0].tag === undefined) {
                                                    sessionStorage.removeItem('info')
                                                } else {
                                                    sessionStorage.setItem('info', JSON.stringify(res.data.company))
                                                }
                                            }).catch(error => {
                                                colorMsg('yellow', 'Dados atualizados! Porém houve um erro ao recuperar as informações do servidor. Feche a página e entre novamente para obter os dados atualizados.')
                                            })


                                        }).catch(error => {
                                            resposta = error.toJSON();
                                            if (resposta.status === 404) {
                                                colorMsg('RED', 'Erro 404 - Requisição invalida')
                                            } else {
                                                colorMsg('RED', `Erro ${resposta.status} - ${resposta.message}`)
                                            }
                                        })

                                } else { colorMsg('red', 'Erro ao enviar dados. Recarregue a página e tente novamente.') }
                            } else { colorMsg('red', 'Erro ao enviar dados. Recarregue a página e tente novamente.') }
                        } else {
                            alert('Usuário não autenticado.')
                            const companyTag = JSON.parse(sessionStorage.getItem('tag'))
                            window.location.href = `/${companyTag}/login`
                        }
                    } else { colorMsg('RED', 'Erro ao enviar dados. Recarregue a página e tente novamente.') }
                } else { colorMsg('RED', 'Erro ao enviar dados. Recarregue a página e tente novamente.') }
            } else { colorMsg('RED', 'Erro ao enviar dados. Recarregue a página e tente novamente.') }
        } else { colorMsg('RED', 'Preencha todos os campos...') }


        document.getElementById('btn-cad')['disabled'] = false
    }


    return (<>
        <Menu></Menu>
        <div className='logo-page'>
            <h4>Informações:</h4>
        </div>

        <div className="data-checkout">
            <br></br>
            <div style={{ 'width': '100%' }}>
                <div style={{ 'width': '100%', 'display': 'inline' }}>
                    <p style={{ 'width': '100%', 'display': 'flex', 'margin': '0 0 7px 0' }}>Empresa:</p>
                    <input type='text' className="ad-inp" id="ad-name" defaultValue={data[0].name} style={{ 'width': '100%' }}></input>
                </div>
                <div style={{ 'width': '100%', 'display': 'inline' }}>
                    <p style={{ 'width': '100%', 'display': 'flex', 'margin': '0 0 7px 0' }}>Tag:</p>
                    <input type='text' className="ad-inp" id="ad-tag" defaultValue={data[0].tag} style={{ 'width': '100%' }} disabled></input>
                </div>
                <div style={{ 'width': '100%', 'display': 'inline' }}>
                    <p style={{ 'width': '100%', 'display': 'flex', 'margin': '0 0 7px 0' }}>Link Logo:</p>
                    <input type='text' className="ad-inp" id="ad-logo" defaultValue={data[0].logo} style={{ 'width': '100%' }}></input>
                </div>
                <div style={{ 'width': '100%', 'display': 'inline' }}>
                    <p style={{ 'width': '100%', 'display': 'flex', 'margin': '0 0 7px 0' }} >Cor de fundo da página:</p>
                    <input type='color' className="ad-inp" id="ad-color" defaultValue={data[0].backcolor} style={{ 'width': '30%', 'padding': '0 5px 0 5px' }} onChange={() => document.body.style.backgroundColor = (document.getElementById('ad-color')['value'])} onBlur={() => document.body.style.backgroundColor = '#FFFFFF'}></input>
                </div>
                <div style={{ 'width': '100%', 'display': 'inline' }}>
                    <p style={{ 'width': '100%', 'display': 'flex', 'margin': '0 0 7px 0' }}>WhatsApp:</p>
                    <input type='text' className="ad-inp" id="ad-wha" onChange={verifyTel} defaultValue={telFormated} style={{ 'width': '100%' }}></input>
                </div>
                <div style={{ 'width': '100%', 'display': 'inline' }}>
                    <p style={{ 'width': '100%', 'margin': '0 0 7px 0' }}>Taxa de entrega:</p>
                    <input type='text' className="ad-inp" id="ad-tax" onChange={verifyTaxa} defaultValue={`R$ ${data[0].txentrega}`} style={{ 'width': '100%' }}></input>
                </div>
            </div>
        </div>


        <p style={{ 'width': '100%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '30px 0 7px 0' }}>Modos de pagamento aceitos:</p>
        <div style={{ 'width': '100%', 'display': 'flex' }}>
            <OptionsPayModes ></OptionsPayModes>
        </div>
        <div>
            <p style={{ 'width': '100%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '30px 0 7px 0' }}>Categorias dos produtos:</p>
            <div style={{ 'width': '100%', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center' }}>
                <OptionsCateg ></OptionsCateg>
            </div>
        </div >

        <h4>Endereço:</h4>
        <div style={{ 'width': '100%' }}>
            <div style={{ 'width': '100%', 'display': 'flex' }}>
                <p style={{ 'width': '20%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '0 0 7px 0' }}>Rua:</p>
                <input type='text' className="ad-inp" id="ad-rua" defaultValue={data[0].adrrua} style={{ 'width': '70%' }}></input>
            </div>
            <div style={{ 'width': '100%', 'display': 'flex' }}>
                <p style={{ 'width': '20%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '0 0 7px 0' }}>Número:</p>
                <input type='text' className="ad-inp" id="ad-num" defaultValue={data[0].adrnum} style={{ 'width': '70%' }}></input>
            </div>
            <div style={{ 'width': '100%', 'display': 'flex' }}>
                <p style={{ 'width': '20%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '0 0 7px 0' }}>Casa/Apto:</p>
                <input type='text' className="ad-inp" id="ad-com" defaultValue={data[0].adrcom} style={{ 'width': '70%' }}></input>
            </div>
            <div style={{ 'width': '100%', 'display': 'flex' }}>
                <p style={{ 'width': '20%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '0 0 7px 0' }}>Bairro:</p>
                <input type='text' className="ad-inp" id="ad-bai" defaultValue={data[0].adrbai} style={{ 'width': '70%' }}></input>
            </div>
            <div style={{ 'width': '100%', 'display': 'flex' }}>
                <p style={{ 'width': '20%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '0 0 7px 0' }}>Cidade:</p>
                <input type='text' className="ad-inp" id="ad-cid" defaultValue={data[0].adrcid} style={{ 'width': '70%' }}></input>
            </div>
            <div style={{ 'width': '100%', 'display': 'flex' }}>
                <p style={{ 'width': '20%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '0 0 7px 0' }}>Estado:</p>
                <input type='text' className="ad-inp" id="ad-est" defaultValue={data[0].adrest} style={{ 'width': '70%' }} autoComplete="off"></input>
            </div>
        </div>
        <button id='btn-cad' className="btn btn-success" onClick={updateInfo} style={{ 'marginTop': '15px', 'marginBottom': '30px' }}>Salvar Dados</button>
        <textarea className="ad-inp" id='ad-resposta' defaultValue="Resposta do servidor >" disabled style={{ 'width': '97%', 'height': '100px', 'backgroundColor': 'white', 'color': 'black', 'resize': 'none' }}></textarea>
    </>
    )
}

export default Info;