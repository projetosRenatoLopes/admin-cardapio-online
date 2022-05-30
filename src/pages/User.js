import InputEmail from "../components/InputEmail";
import InputPass from "../components/InputPass";
import Menu from "../components/Menu/menu";
import api from "../services/api";

const User = () => {
    const userAdmin = sessionStorage.getItem('userAdmin')
    const companyTag = sessionStorage.getItem('tag')
    var user;
    if (userAdmin === undefined) {
        user = ''
    } else {
        user = userAdmin
    }

    const validPass = () => {
        var pass = document.getElementById('pass')["value"];
        if (pass === '') {
            document.getElementById("pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-actual-pass").innerText = ("Digite sua senha atual.")
            return false;
        } else {
            cleanValidPass();
            return true;
        }
    }
    const cleanValidPass = () => {
        document.getElementById("pass").style.boxShadow = 'none';
        document.getElementById("validation-actual-pass").innerText = ("")
    }
    const validNewPass = () => {
        var pass = document.getElementById('new-pass')["value"];
        var passTwo = document.getElementById('rep-new-pass')["value"];
        if (pass === "") {
            document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-pass").innerText = ("Digite a nova senha.")
            return false;
        } else if (pass.length < '8') {
            document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-pass").innerText = ("Sua nova senha deve ter 8 dígitos ou mais.");
            return false;
        } else if (pass !== passTwo) {
            document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-pass").innerText = ("Senhas não conferem.");
            return false;
        } else {
            cleanValidNewPass();
            return true;
        }
    }
    const cleanValidNewPass = () => {
        document.getElementById("new-pass").style.boxShadow = 'none';
        document.getElementById("rep-new-pass").style.boxShadow = 'none';
        document.getElementById("validation-pass").innerText = ("")
    }

    const validName = () => {
        var name = document.getElementById('user')["value"];
        if (name === "") {
            console.log('to aqui')
            document.getElementById("user").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-name").innerText = ("Digite o nome.")
            return false;
        } else {
            cleanValidName();
            return true;
        }
    }
    const cleanValidName = () => {
        document.getElementById("user").style.boxShadow = 'none';
        document.getElementById("validation-name").innerText = ("")
    }

    async function editUser() {
        validName();
        validPass();
        validNewPass();
        if (validPass() === true && validNewPass() === true && validName() === true) {
            const id = sessionStorage.getItem('userId')
            const tag = sessionStorage.getItem('tag')
            const token = localStorage.getItem(`${tag}-token`)
            if (id === null || tag === null || id === "" || tag === "") {
                alert('Erro ao enviar informações!\nAtualize a página e tente novamente.')
            } else {
                const nameEdit = document.getElementById('user')['value']
                const passEdit = document.getElementById('pass')['value']
                const newPassEdit = document.getElementById('new-pass')['value']
                const idEdit = sessionStorage.getItem('userId')
                const tagEdit = tag.replace('/', "")
                const userEdited = [{ "name": nameEdit, "pass": passEdit, "newpass": newPassEdit, "tag": tagEdit, "id": idEdit }]
                var resposta;
                await api({
                    method: 'PUT',
                    url: `/admin/update`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    data: userEdited
                })
                    .then(resp => {
                       
                        resposta = resp.data;

                        localStorage.setItem(`${companyTag}-user`, resposta.user)
                        alert(`${resposta.message}`)
                        window.location.href = `${tag}/home`
                    }).catch(error => {
                        resposta = error.toJSON();
                        console.log(resposta)
                        if (resposta.status === 404) {
                            alert('Erro 404 - Requisição invalida')
                        } else if (resposta.status === 401) {
                            alert('A senha atual está incorreta.')
                        } else { alert(`Erro ${resposta.status} - ${resposta.message}`) }
                    })
            }
        }
    }
    const userAdm = localStorage.getItem(`${companyTag}-user`)
    return (
        <>
            <Menu></Menu>
            <div className='logo-page'>
                <h3>Alterar usuário</h3>
            </div>
            <h5 id='msg' style={{ 'width': 'auto', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }}> </h5>
            <div className="field-login">

                {/* <input type='text'  placeholder="Login" style={{ 'width': '50%' }}></input>
            <input type='password' placeholder="Senha" style={{ 'width': '50%' }}></input> */}
                <h4>Usuário: {user}</h4>
                <InputEmail className='input-user' placeholder='Nome' defaultValue={userAdm} />
                <div id="validation-name"></div>
                <InputPass id='pass' className='input-pass' placeholder='Senha atual' />
                <div id="validation-actual-pass"></div>
                <InputPass id='new-pass' className='input-pass' placeholder='Nova senha' />
                <InputPass id='rep-new-pass' className='input-pass' placeholder='Repita a nova senha' />
                <div id="validation-pass"></div>
                <button type='submit' className="btn-co btn-l btn-g" style={{ 'marginTop': '15px', 'width': '150px' }} onClick={editUser}>Salvar</button>
            </div>
        </>
    )


}

export default User;