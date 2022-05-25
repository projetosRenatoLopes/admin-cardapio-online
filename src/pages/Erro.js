const Erro = () => {
    const imgErro = '/img/500.png'
    const reload = () => {
        const company = sessionStorage.getItem('tag')
        window.location.href =  `${company}`
    }
    return (
        <>
            <div className='title-page'>
                <p>500 - Erro interno do Servidor!</p>
            </div>

            <div className='logo-page'>
                <img src={imgErro} className="img-logo-page" alt="img-logo" style={{ 'maxWidth': '20rem', 'minWidth': '16rem' }}></img>
            </div>
            <br></br>
            <div className="div-button" style={{'display':'flex','alignItems':'center','justifyContent':'center'}}>
                <button className="btn btn-success" onClick={reload}>Recarregar página</button>
            </div>
        </>
    )
}

export default Erro;

