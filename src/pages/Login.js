import api from "../services/api"
import InputEmail from "../components/InputEmail";
import InputPass from "../components/InputPass";

const Login = () => {
    const companyTag = sessionStorage.getItem('tag')
    const company = JSON.parse(sessionStorage.getItem('info'))
    const info = JSON.parse(sessionStorage.getItem('info'))
    const logo = info[0].logo
    
    const token = localStorage.getItem(`${companyTag}-token`)
    if (token !== null && token !== undefined) {
        window.location.href = `${companyTag}/home`
    }

    const signin = async () => {
        document.getElementById('msg')['textContent'] = 'Entrando...'
        document.getElementById('msg').style.color = 'blue'
        const user = document.getElementById('user')['value']
        const pass = document.getElementById('pass')['value']

        const dadosUser = {
            "user": user,
            "password": pass,
            "page": company[0].tag
        }

        await api({
            method: 'POST',
            url: '/admin/login',
            data: dadosUser,
        }).then(async res => {
            if (res.status === 204) {
                document.getElementById('msg')['textContent'] = 'Usuário e/ou senha incorretos'
                document.getElementById('msg').style.color = 'red'
            } else if (res.status === 200) {
                if (res.data.token !== undefined && res.data.id !== undefined) {
                    localStorage.setItem(`${companyTag}-token`, res.data.token)
                    sessionStorage.setItem('userId', res.data.id)
                    localStorage.setItem(`${companyTag}-user`, res.data.name)
                    
               
                }
                document.getElementById('msg')['textContent'] = res.data.name
                document.getElementById('msg').style.color = 'green'
                window.location.href = `${companyTag}/home`
            } else {
                document.getElementById('msg')['textContent'] = 'Erro ao consultar usuário! Tente novamente.'
                document.getElementById('msg').style.color = 'red'
            }
        }).catch((error) => {
            if (error.message === 'Request failed with status code 401') {
                document.getElementById('msg')['textContent'] = `${error.name} - Você não tem permissão para entrar nesta página.`
                document.getElementById('msg').style.color = 'red'
            } else {
                document.getElementById('msg')['textContent'] = 'Erro ao consultar usuário! Tente novamente.'
                document.getElementById('msg').style.color = 'red'
            }
        })
    }

    return (
        <>
            <div className='logo-page'>
                <img src={logo} alt='logo' style={{ 'width': '300px' }}></img>
            </div>
            <h5 id='msg' style={{ 'width': 'auto', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }}> </h5>
            <div className="field-login">

                {/* <input type='text'  placeholder="Login" style={{ 'width': '50%' }}></input>
            <input type='password' placeholder="Senha" style={{ 'width': '50%' }}></input> */}
                <InputEmail className='input-user' placeholder='Usuário' />
                <InputPass id='pass' className='input-pass' placeholder='Senha' />
                <button type='submit' className="btn-co btn-l btn-g" onClick={signin} style={{ 'marginTop': '15px', 'width': '150px' }}>Entrar</button>
            </div>
        </>
    )

}

export default Login;