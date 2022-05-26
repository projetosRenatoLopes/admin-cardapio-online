import { useLocation } from "react-router-dom"

const NotFound = () => {
    const company = useLocation()
    if (company.pathname.split('/')[1] === '' || company.pathname.split('/')[1] === 'notfound') {
        const imgErro = '/img/404.png'
        return (
            <>
                <div className='title-page'>
                    <p>404 - Página não Encontrada!</p>
                </div>

                <div className='logo-page'>
                    <img src={imgErro} className="img-logo-page" alt="img-logo" style={{ 'maxWidth': '30rem', 'minWidth': '16rem' }}></img>
                </div>
                <br></br>
                {/* <div className="div-button" style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center' }}>
                    <button className="btn btn-success" onClick={reload}>Voltar ao início </button>
                </div> */}
            </>
        )
    } else {
        const tag = `/${company.pathname.split('/')[1]}`;
        // console.log("2 "+company.pathname.split('/')[2])
        window.location.href = tag
    }



}

export default NotFound;
