import LogoPage from "../components/Logo";
import Menu from "../components/Menu/menu";
import InfoCompany from "../components/Companny/index.js";
import api from "../services/api";
import { AiOutlineTrademark } from "react-icons/ai";

const Home = () => {
    const companyTag = sessionStorage.getItem('tag')
    const token = localStorage.getItem(`${companyTag}-token`)
    if (token === null || token === undefined) {
        window.location.href = `${companyTag}/login`
    } else {
        const token = localStorage.getItem(`${companyTag}-token`)
        var resposta;
        api({
            method: 'POST',
            url: `/admin/validtoken`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            data: {"tagprod":companyTag.replace('/', "")}
        })
            .then(resp => {
                resposta = resp.data;
               localStorage.setItem(`${companyTag}-user`, resposta.user)
               sessionStorage.setItem('userId', resposta.id)
               console.log(resposta)

            }).catch(error => {
                resposta = error.toJSON();               
                if (resposta.status === 500) {
                    localStorage.removeItem(`${companyTag}-token`)
                    alert('Sessão inválida')
                    window.location.href = `${companyTag}/login`
                } else {
                    localStorage.removeItem(`${companyTag}-token`)
                    alert(`Erro ${resposta.status} - ${resposta.message}`);
                    window.location.href = `${companyTag}/login` 
                }
            })
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