import api from "../services/api";
import Menu from "../components/Menu/menu";

const Horario = () => {
    const companyTag = sessionStorage.getItem('tag')
    const token = localStorage.getItem(`${companyTag}-token`)
    if (token === null || token === undefined) {
        window.location.href = `${companyTag}/login`
    }

    const data = JSON.parse(sessionStorage.getItem('info'))
    var domRadOp = true, domRadCl = false, segRadOp = true, segRadCl = false, terRadOp = true, terRadCl = false, quaRadOp = true, quaRadCl = false, quiRadOp = true, quiRadCl = false, sexRadOp = true, sexRadCl = false, sabRadOp = true, sabRadCl = false;
    if (data[0].funcdom.slice(0, 5) === 'Fecha') { domRadOp = false; domRadCl = true; }
    if (data[0].funcseg.slice(0, 5) === 'Fecha') { segRadOp = false; segRadCl = true; }
    if (data[0].functer.slice(0, 5) === 'Fecha') { terRadOp = false; terRadCl = true; }
    if (data[0].funcqua.slice(0, 5) === 'Fecha') { quaRadOp = false; quaRadCl = true; }
    if (data[0].funcqui.slice(0, 5) === 'Fecha') { quiRadOp = false; quiRadCl = true; }
    if (data[0].funcsex.slice(0, 5) === 'Fecha') { sexRadOp = false; sexRadCl = true; }
    if (data[0].funcsab.slice(0, 5) === 'Fecha') { sabRadOp = false; sabRadCl = true; }

    function verifyRadioCheck(day) {
        const elementOp = document.getElementById(`rd-${day}-closed`)['checked']
        if (elementOp === false) {
            document.getElementById(`ad-${day}-open`)['disabled'] = false
            document.getElementById(`ad-${day}-closed`)['disabled'] = false
        } else {
            document.getElementById(`ad-${day}-open`)['disabled'] = true
            document.getElementById(`ad-${day}-closed`)['disabled'] = true
        }
    }

    const colorMsg = (color, msg) => {
        document.getElementById('ad-resposta')['value'] = `${msg}`
        document.getElementById('ad-resposta').style.boxShadow = `0 -1px 0 ${color}, 0 0 2px ${color}, 0 2px 4px ${color}`
    }

    const updateHours = async () => {
        document.getElementById('btn-cad')['disabled'] = true

        function verifyHoursOpCl(day, dayWeek) {
            const elementCl = document.getElementById(`rd-${day}-closed`)['checked']
            if (elementCl === true) {
                return 'Fechado'
            } else {
                var horaInicio = document.getElementById(`ad-${day}-open`)['value']
                var horaFim = document.getElementById(`ad-${day}-closed`)['value']
                if (`${horaInicio}-${horaFim}` === '-' || `${horaInicio}-${horaFim}`.length < 11) {
                    alert(`Verifique se preencheu corretamente os campos de ${dayWeek}`)
                    return ""
                } else {
                    if (horaFim < horaInicio) {
                        alert(`A hora final de ${dayWeek} é menor que a hora de inicio.`)
                        return ""
                    } else {
                        return `${horaInicio}-${horaFim}`
                    }
                }
            }
        }

        const dom = verifyHoursOpCl('dom', 'Domingo'),
            seg = verifyHoursOpCl('seg', 'Segunda'),
            ter = verifyHoursOpCl('ter', 'Terça'),
            qua = verifyHoursOpCl('qua', 'Quarta'),
            qui = verifyHoursOpCl('qui', 'Quinta'),
            sex = verifyHoursOpCl('sex', 'Sexta'),
            sab = verifyHoursOpCl('sab', 'Sábado');



        const data = JSON.parse(sessionStorage.getItem('info'))
        const dadosEmpresa = {
            "empadrbai": data[0].adrbai,
            "empadrcid": data[0].adrcid,
            "empadrcom": data[0].adrcom,
            "empadrest": data[0].adrest,
            "empadrnum": data[0].adrnum,
            "empadrrua": data[0].adrrua,
            "empcategs": data[0].categs,
            "empfuncdom": dom,
            "empfuncqua": qua,
            "empfuncqui": qui,
            "empfuncsab": sab,
            "empfuncseg": seg,
            "empfuncsex": sex,
            "empfuncter": ter,
            "emplogo": data[0].logo,
            "empname": data[0].name,
            "emppaymodes": data[0].paymodes,
            "emptag": data[0].tag,
            "emptel": data[0].tel,
            "emptxentrega": data[0].txentrega,
            "backcolor": data[0].backcolor
        }

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
                        }
                    } else { colorMsg('RED', 'Erro ao enviar dados. Recarregue a página e tente novamente.') }
                } else { colorMsg('RED', 'Erro ao enviar dados. Recarregue a página e tente novamente.') }
            } else { colorMsg('RED', 'Erro ao enviar dados. Recarregue a página e tente novamente.') }
        } else { colorMsg('RED', 'Preencha todos os campos...') }


        document.getElementById('btn-cad')['disabled'] = false
    }



    return (
        <>
            <Menu></Menu>
            <div className='logo-page'>
                <h4>Horário de Funcionamento:</h4>
            </div>

            <div style={{ 'width': '100%' }}>
                <div style={{ 'width': '100%', 'display': 'flex' }}>
                    <p style={{ 'width': '20%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '0 0 7px 0' }}>Domingo:</p>
                    <div style={{ 'display': 'flex', 'alignItems': 'center', 'marginRight': '3px', 'marginBottom': '7px' }}>
                        <input type='radio' id='rd-dom-closed' name='chk-dom' value='closed' defaultChecked={domRadCl} onChange={() => verifyRadioCheck('dom')}></input>
                        <label htmlFor='rd-dom-closed'>Fechado</label>
                        <input type='radio' id='rd-dom-open' name='chk-dom' value='open' defaultChecked={domRadOp} onChange={() => verifyRadioCheck('dom')}></input>
                        <label htmlFor='rd-dom-open'>Definir: </label>
                    </div>
                    <input type='time' className="ad-inp" id="ad-dom-open" defaultValue={data[0].funcdom.slice(0, 5)} style={{ 'width': '17%' }} disabled={domRadCl}></input>
                    <input type='time' className="ad-inp" id="ad-dom-closed" defaultValue={data[0].funcdom.slice(6, 11)} style={{ 'width': '17%' }} disabled={domRadCl}></input>
                </div>
                <div style={{ 'width': '100%', 'display': 'flex' }}>
                    <p style={{ 'width': '20%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '0 0 7px 0' }}>Segunda:</p>
                    <div style={{ 'display': 'flex', 'alignItems': 'center', 'marginRight': '3px', 'marginBottom': '7px' }}>
                        <input type='radio' id='rd-seg-closed' name='chk-seg' value='closed' defaultChecked={segRadCl} onChange={() => verifyRadioCheck('seg')}></input>
                        <label htmlFor='rd-seg-closed'>Fechado</label>
                        <input type='radio' id='rd-seg-open' name='chk-seg' value='open' defaultChecked={segRadOp} onChange={() => verifyRadioCheck('seg')}></input>
                        <label htmlFor='rd-seg-open'>Definir: </label>
                    </div>
                    <input type='time' className="ad-inp" id="ad-seg-open" defaultValue={data[0].funcseg.slice(0, 5)} style={{ 'width': '17%' }} disabled={segRadCl}></input>
                    <input type='time' className="ad-inp" id="ad-seg-closed" defaultValue={data[0].funcseg.slice(6, 11)} style={{ 'width': '17%' }} disabled={segRadCl}></input>
                </div>
                <div style={{ 'width': '100%', 'display': 'flex' }}>
                    <p style={{ 'width': '20%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '0 0 7px 0' }}>Terça:</p>
                    <div style={{ 'display': 'flex', 'alignItems': 'center', 'marginRight': '3px', 'marginBottom': '7px' }}>
                        <input type='radio' id='rd-ter-closed' name='chk-ter' value='closed' defaultChecked={terRadCl} onChange={() => verifyRadioCheck('ter')}></input>
                        <label htmlFor='rd-ter-closed'>Fechado</label>
                        <input type='radio' id='rd-ter-open' name='chk-ter' value='open' defaultChecked={terRadOp} onChange={() => verifyRadioCheck('ter')}></input>
                        <label htmlFor='rd-ter-open'>Definir: </label>
                    </div>
                    <input type='time' className="ad-inp" id="ad-ter-open" defaultValue={data[0].functer.slice(0, 5)} style={{ 'width': '17%' }} disabled={terRadCl}></input>
                    <input type='time' className="ad-inp" id="ad-ter-closed" defaultValue={data[0].functer.slice(6, 11)} style={{ 'width': '17%' }} disabled={terRadCl}></input>
                </div>
                <div style={{ 'width': '100%', 'display': 'flex' }}>
                    <p style={{ 'width': '20%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '0 0 7px 0' }}>Quarta:</p>
                    <div style={{ 'display': 'flex', 'alignItems': 'center', 'marginRight': '3px', 'marginBottom': '7px' }}>
                        <input type='radio' id='rd-qua-closed' name='chk-qua' value='closed' defaultChecked={quaRadCl} onChange={() => verifyRadioCheck('qua')} ></input>
                        <label htmlFor='rd-qua-closed'>Fechado</label>
                        <input type='radio' id='rd-qua-open' name='chk-qua' value='open' defaultChecked={quaRadOp} onChange={() => verifyRadioCheck('qua')}></input>
                        <label htmlFor='rd-qua-open'>Definir: </label>
                    </div>
                    <input type='time' className="ad-inp" id="ad-qua-open" defaultValue={data[0].funcqua.slice(0, 5)} style={{ 'width': '17%' }} disabled={quaRadCl}></input>
                    <input type='time' className="ad-inp" id="ad-qua-closed" defaultValue={data[0].funcqua.slice(6, 11)} style={{ 'width': '17%' }} disabled={quaRadCl}></input>
                </div>
                <div style={{ 'width': '100%', 'display': 'flex' }}>
                    <p style={{ 'width': '20%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '0 0 7px 0' }}>Quinta:</p>
                    <div style={{ 'display': 'flex', 'alignItems': 'center', 'marginRight': '3px', 'marginBottom': '7px' }}>
                        <input type='radio' id='rd-qui-closed' name='chk-qui' value='closed' defaultChecked={quiRadCl} onChange={() => verifyRadioCheck('qui')}></input>
                        <label htmlFor='rd-qui-closed'>Fechado</label>
                        <input type='radio' id='rd-qui-open' name='chk-qui' value='open' defaultChecked={quiRadOp} onChange={() => verifyRadioCheck('qui')}></input>
                        <label htmlFor='rd-qui-open'>Definir: </label>
                    </div>
                    <input type='time' className="ad-inp" id="ad-qui-open" defaultValue={data[0].funcqui.slice(0, 5)} style={{ 'width': '17%' }} disabled={quiRadCl}></input>
                    <input type='time' className="ad-inp" id="ad-qui-closed" defaultValue={data[0].funcqui.slice(6, 11)} style={{ 'width': '17%' }} disabled={quiRadCl}></input>
                </div>
                <div style={{ 'width': '100%', 'display': 'flex' }}>
                    <p style={{ 'width': '20%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '0 0 7px 0' }}>Sexta:</p>
                    <div style={{ 'display': 'flex', 'alignItems': 'center', 'marginRight': '3px', 'marginBottom': '7px' }}>
                        <input type='radio' id='rd-sex-closed' name='chk-sex' value='closed' defaultChecked={sexRadCl} onChange={() => verifyRadioCheck('sex')}></input>
                        <label htmlFor='rd-sex-closed'>Fechado</label>
                        <input type='radio' id='rd-sex-open' name='chk-sex' value='open' defaultChecked={sexRadOp} onChange={() => verifyRadioCheck('sex')}></input>
                        <label htmlFor='rd-sex-open'>Definir: </label>
                    </div>
                    <input type='time' className="ad-inp" id="ad-sex-open" defaultValue={data[0].funcsex.slice(0, 5)} style={{ 'width': '17%' }} disabled={sexRadCl}></input>
                    <input type='time' className="ad-inp" id="ad-sex-closed" defaultValue={data[0].funcsex.slice(6, 11)} style={{ 'width': '17%' }} disabled={sexRadCl}></input>
                </div>
                <div style={{ 'width': '100%', 'display': 'flex' }}>
                    <p style={{ 'width': '20%', 'alignItems': 'center', 'justifyContent': 'center', 'display': 'flex', 'margin': '0 0 7px 0' }}>Sábado:</p>
                    <div style={{ 'display': 'flex', 'alignItems': 'center', 'marginRight': '3px', 'marginBottom': '7px' }}>
                        <input type='radio' id='rd-sab-closed' name='chk-sab' value='closed' defaultChecked={sabRadCl} onChange={() => verifyRadioCheck('sab')}></input>
                        <label htmlFor='rd-sab-closed'>Fechado</label>
                        <input type='radio' id='rd-sab-open' name='chk-sab' value='open' defaultChecked={sabRadOp} onChange={() => verifyRadioCheck('sab')}></input>
                        <label htmlFor='rd-sab-open'>Definir: </label>
                    </div>
                    <input type='time' className="ad-inp" id="ad-sab-open" defaultValue={data[0].funcsab.slice(0, 5)} style={{ 'width': '17%' }} disabled={sabRadCl}></input>
                    <input type='time' className="ad-inp" id="ad-sab-closed" defaultValue={data[0].funcsab.slice(6, 11)} style={{ 'width': '17%' }} disabled={sabRadCl}></input>
                </div>
            </div>
            <button id='btn-cad' className="btn btn-success" onClick={updateHours} style={{ 'marginTop': '15px', 'marginBottom': '30px' }}>Salvar Dados</button>
            <textarea className="ad-inp" id='ad-resposta' defaultValue="Resposta do servidor >" disabled style={{ 'width': '97%', 'height': '100px', 'backgroundColor': 'white', 'color': 'black', 'resize': 'none' }}></textarea>
        </>
    )

}

export default Horario;