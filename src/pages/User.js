import InputEmail from "../components/InputEmail";
import InputPass from "../components/InputPass";
import Menu from "../components/Menu/menu";

const User = () => {
    const userAdmin = sessionStorage.getItem('userAdmin')
    var user;
    if (userAdmin === undefined) {
        user = ''
    } else {
        user = userAdmin
    }
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
                <InputEmail className='input-user' placeholder='Nome' />
                <InputPass className='input-pass' placeholder='Senha atual' />
                <InputPass className='input-pass' placeholder='Nova senha' />
                <InputPass className='input-pass' placeholder='Repita a nova senha' />
                <button type='submit' className="btn-co btn-l btn-g" style={{ 'marginTop': '15px', 'width': '150px' }}>Salvar</button>
            </div>
        </>
    )


}

export default User;