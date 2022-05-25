
import React from "react";

var compannyLogo = null;
const getInfoApi = JSON.parse(sessionStorage.getItem('info'))
if (getInfoApi === null) {
    compannyLogo = ''
} else {
    compannyLogo = getInfoApi[0].logo;
}
//var compannyLogo = 'https://imagensemoldes.com.br/wp-content/uploads/2020/07/Desenho-Lanche-PNG.png';
//var compannyLogo = 'https://yourimageshare.com/ib/eLJjfrf5ji.png';


const LogoPage = () => {
    return (
        <>
            <div className='logo-page'>
                <img src={compannyLogo} className="img-logo-page" alt="img-logo" style={{ 'maxWidth': '20rem', 'minWidth': '16rem' }}></img>
            </div>
        </>
    )
}

export default LogoPage