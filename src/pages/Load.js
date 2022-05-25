import React from 'react';
import { useLocation } from 'react-router-dom'
import api from '../../src/services/api';

const Load = () => {
  const company = useLocation()
  const companyTag = company.pathname

  const regex = /\W|_/;

  if(companyTag === '/clientes'){
    sessionStorage.removeItem('tag')
    window.location.href = '/cardapioonline'
  }
  
  if (regex.test(companyTag.substring(1)) === false) {
    sessionStorage.setItem('tag', `${companyTag}`)
  } else {
    sessionStorage.removeItem('tag')
    window.location.href = `erro/notfound`
  }
  
  if(companyTag === '/erro' || companyTag === '/null'){
    sessionStorage.removeItem('tag')
    window.location.href = '/'
  }


  setTimeout(async () => {
    //categorias 
    await api.get(`/opcoes/categorias`).then(res => {
        if (res.data === undefined) {
            sessionStorage.removeItem('categDesc')
        } else {
            sessionStorage.setItem('categDesc', JSON.stringify(res.data))
            sessionStorage.setItem('categ', JSON.stringify(res.data))
        }
    }).catch(error => {
        window.location.href = '/erro'
    })

    //modos de pagamento
    await api.get(`/opcoes/modospagamento`).then(res => {
        if (res.data === undefined) {
            sessionStorage.removeItem('payModes')
        } else {
            sessionStorage.setItem('payModes', JSON.stringify(res.data))            
        }
    }).catch(error => {
        window.location.href = '/erro'
    })

    //dados empresa
    await api.get(`/empresa/${companyTag}`).then(res => {
        if (res.data.company[0].tag === undefined) {
            sessionStorage.removeItem('tag')
            window.location.href = `${companyTag}/notfound`
        } else {
            sessionStorage.setItem('info', JSON.stringify(res.data.company))
        }
    }).catch(error => {
        window.location.href = '/erro'
    })

    //produtos da empresa
    await api.get(`/produtos/${companyTag}`).then(res => {
        if (res.data[0].length === 0) {
            sessionStorage.setItem('listProduct', JSON.stringify([]))
        } else {
            var list = res.data[0].products;
            sessionStorage.setItem('listProduct', JSON.stringify(list))
            sessionStorage.setItem('viewProducts', JSON.stringify(list))
        }

        window.location.href = `${companyTag}/login`
    }).catch(error => {
        window.location.href = '/erro'
    })

}, 5000);


  return (
    <>
      <div className='title-page'>
        <p>Carregando...</p>
      </div>

      <div className='logo-page'>
        <img src='https://acegif.com/wp-content/uploads/loading-23.gif' className="img-logo-page" alt="img-logo" style={{ 'maxWidth': '20rem', 'minWidth': '16rem' }}></img>
      </div>
    </>
  )
}

export default Load;


