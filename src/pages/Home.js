import LogoPage from "../components/Logo";
import Menu from "../components/Menu/menu";
import InfoCompany from "../components/Companny/index.js";

const Home = () => {
    const companyTag = sessionStorage.getItem('tag')
    const token = localStorage.getItem(`${companyTag}-token`)
    if (token === null || token === undefined) {
        window.location.href = `${companyTag}/login`
    }

    const products = JSON.parse(sessionStorage.getItem('listProduct'))
    var ativos = [];
    var desativos = [];
    products.forEach(element => {
        if (element.status === 'Ativo') {
            ativos.push(element)
        }
    })
    products.forEach(element => {
        if (element.status === 'Desativado') {
            desativos.push(element)
        }
    })

    return (<>
        <Menu></Menu>
        <div className='logo-page'>
            <LogoPage />
        </div>
        <InfoCompany></InfoCompany>
        <h4 style={{ 'marginBottom': '5px' }}>{products.length} produtos:  </h4>
        <h5 style={{ 'margin': '0 0 0 0' }}>{ativos.length} Ativos. </h5>
        <h5 style={{ 'margin': '0 0 0 0' }}>{desativos.length} Desativados. </h5>
    </>)
}

export default Home;