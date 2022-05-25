import { Link } from 'react-router-dom'
import { CompanyName } from "../Companny/index.js";
import { RiMenuLine, RiMenuUnfoldFill } from 'react-icons/ri'

const Menu = () => {
    const companyTag = sessionStorage.getItem('tag')

    const userAdmin = sessionStorage.getItem('userAdmin')
    var user;
    if (userAdmin === undefined) {
        user = ''
    } else {
        user = userAdmin
    }

    const logout = () => {
        sessionStorage.removeItem('userId')
        localStorage.removeItem(`${companyTag}-token`)
        sessionStorage.removeItem('screen')
        sessionStorage.removeItem('userAdmin')
        window.location.href = `${companyTag}/login`
    }

    function menuOpen() {
        const token = localStorage.getItem(`${companyTag}-token`)
        if (token !== null) {
            const menu = document.getElementById('menu');
            if (menu.style.display === 'none') {
                document.getElementById('icon-menu').style.display = 'none';
                document.getElementById('icon-menu-open').style.display = 'flex';
                document.getElementById('back-menu').style.display = 'flex';
                menu.style.display = 'inline';
            } else {
                document.getElementById('icon-menu').style.display = 'flex';
                document.getElementById('icon-menu-open').style.display = 'none';
                document.getElementById('back-menu').style.display = 'none';
                menu.style.display = 'none';
            }
        }
    }

    return (<>
        <div id='menu' className='menu' style={{ 'display': 'none' }}>
            <div className='itens-menu'>
                <Link to={`${companyTag}/user`}><div>{user}</div></Link>
                <Link to={`${companyTag}/home`}><div>Inicio</div></Link>
                <Link to={`${companyTag}/info`}><div>Informações</div></Link>
                <Link to={`${companyTag}/produtos`}><div>Produtos</div></Link>
                <Link to={`${companyTag}/horario`}><div>Horário</div></Link>
                <div onClick={logout}>Sair</div>
            </div>
        </div>
        <div className='title-page'>
            <div>
                {CompanyName}
            </div>
            <div id='icon-menu' style={{ 'display': 'flex' }}>
                <RiMenuLine onClick={menuOpen} />
            </div>
            <div id='icon-menu-open' style={{ 'display': 'none' }}>
                <RiMenuUnfoldFill onClick={menuOpen} />
            </div>
        </div>
        <div id='back-menu' onClick={menuOpen}>
        </div>
    </>
    )

}

export default Menu;