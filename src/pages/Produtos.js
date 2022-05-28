import { useState } from "react";
import Menu from "../components/Menu/menu";
import { compare } from '../services/orderById/'
import replaceAccent from '../utils/replaceAccent.js';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import api from "../services/api.js";

const Produtos = () => {
    const companyTag = sessionStorage.getItem('tag')
    const token = localStorage.getItem(`${companyTag}-token`)
    if (token === null || token === undefined) {
        window.location.href = `${companyTag}/login`
    }


    function ListProducts() {
        function compareName(a, b) {
            if (a.nomeprod < b.nomeprod)
                return -1;
            if (a.nomeprod > b.nomeprod)
                return 1;
            return 0;
        }
        // eslint-disable-next-line no-unused-vars
        var list = [];
        const products = JSON.parse(sessionStorage.getItem('viewProducts'))

        const [product, setProduct] = useState(products.sort(compareName).sort(compare))

        async function pesquisarProd() {
            const pesq = document.getElementById('prod-pesq')['value']
            const listProd = JSON.parse(sessionStorage.getItem('listProduct'))
            const act = document.getElementById('active')['checked']
            const des = document.getElementById('desactive')['checked']
            var verifyStatus;
            if (act === true) {
                verifyStatus = 'Desativado'
            } else if (des === true) {
                verifyStatus = 'Ativo'
            } else { verifyStatus = 'Todos' }
            var newList = [];

            listProd.forEach(element => {
                const stringElement = replaceAccent(element.nomeprod.toLowerCase())
                const stringSearch = replaceAccent(pesq.toLowerCase())
                if (stringElement.includes(stringSearch) && element.status !== verifyStatus) {
                    newList.push(element)
                }
            });
            sessionStorage.setItem('viewProducts', JSON.stringify(newList))

            setProduct(newList.sort(compareName).sort(compare))
        }

        const RenderOptions = (product, key) => {

            async function delProd() {
                var resp = window.confirm(`Deseja exlcuir ${product.nomeprod}\nAtenção: Isso não poderá ser desfeito.`)
                if (resp === true) {
                    const data = JSON.parse(sessionStorage.getItem('info'))
                    const id = product.uuid
                    const token = localStorage.getItem(`${companyTag}-token`)
                    const tagpage = sessionStorage.getItem('tag')
                    if (token !== undefined) {
                        var resposta;
                        await api({
                            method: 'DELETE',
                            url: `/produtos/excluir`,
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: token
                            },
                            data: { "id": id, "tag": tagpage.replace(/[/]/, '') }
                        })
                            .then(resp => {
                                resposta = resp.data;

                                api.get(`/produtos/${data[0].tag}`).then(res => {
                                    if (res.data[0].products === undefined) {
                                        sessionStorage.setItem('listProduct', JSON.stringify([]))
                                        alert('Produto excluído! Porém houve um erro ao recuperar as informações do servidor. \n\nFeche a página e entre novamente para obter os dados atualizados.')
                                    } else {
                                        sessionStorage.setItem('listProduct', JSON.stringify(res.data[0].products))
                                        sessionStorage.setItem('viewProducts', JSON.stringify(res.data[0].products))
                                        const act = document.getElementById('active')['checked']
                                        const des = document.getElementById('desactive')['checked']
                                        var verifyStatus;
                                        if (act === true) {
                                            verifyStatus = 'Desativado'
                                        } else if (des === true) {
                                            verifyStatus = 'Ativo'
                                        } else { verifyStatus = 'Todos' }
                                        var listProdView = res.data[0].products.sort(compareName).sort(compare)

                                        var newList = [];
                                        listProdView.forEach(element => {
                                            if (element.status !== verifyStatus) {
                                                newList.push(element)
                                            }
                                        });
                                        setProduct(newList)
                                        alert(`${product.nomeprod} excluido.`)

                                    }
                                }).catch(error => {
                                    alert('Produto excluído! Porém houve um erro ao recuperar as informações do servidor. \n\nFeche a página e entre novamente para obter os dados atualizados.')
                                })

                            }).catch(error => {
                                resposta = error.toJSON();
                                if (resposta.status === 500) {
                                    alert('Erro 500 - Requisição invalida')
                                } else { alert(`Erro ${resposta.status} - ${resposta.message}`) }
                            })
                    } else { alert('Usuário não autenticado.'); window.location.href = `${companyTag}/login` }


                }
            }

            function verifyEditProd() {
                const data = JSON.parse(sessionStorage.getItem('info'))
                const id = product.uuid,
                    nameProd = document.getElementById(`nome-${product.uuid}`)['value'],
                    descPro = document.getElementById(`desc-${product.uuid}`)['value'],
                    imgPro = document.getElementById(`img-${product.uuid}`)['value'],
                    price = document.getElementById(`preco-${product.uuid}`)['value'],
                    categPro = document.getElementById(`selCateg-${product.uuid}`)['value'],
                    situacao = document.getElementById(`selAtivo-${product.uuid}`)['value'],
                    tag = data[0].tag;
                    const pricePro = price.replace(/[A-Za-z]/, '').replace(/[$]/, '').replace(/[,]/, '.').replace(/( )+/g, '').replace(/[R$ ]/, '');
                const productData = [{ "id": id, "nameprod": nameProd, "priceprod": pricePro, "imgprod": imgPro, "descprod": descPro, "categprod": categPro, "sit": situacao, "tagprod": tag }]
                if (nameProd !== '') {
                    if (descPro !== '') {
                        if (imgPro !== '') {
                            if (pricePro !== '') {
                                const regex = /\d|_/;
                                if (regex.test(pricePro) === true) {
                                    if (categPro !== "") {
                                        editProd(productData)
                                    } else { alert('Selecione uma categoria.') }
                                } else { alert('Preencha corretamente o campo Preço.') }
                            } else { alert('Preencha o campo Preço.') }
                        } else { alert('Preencha o campo Link da Imagem.') }
                    } else { alert('Preencha o campo Descrição.') }
                } else { alert('Preencha o campo nome.') }

            }

            const verifyPriceEdit = () => {
                var tx = document.getElementById(`preco-${product.uuid}`)['value']
                tx = tx.replace(/0,0/g, '');
                tx = tx.replace(/0,00/g, '');
                tx = tx.replace(/0,/g, '');
                console.log(tx)
                tx = tx.replace(/[A-Za-z]/, '');
                tx = tx.replace(/\D/g, '');
                var newTx;
                if (tx.length === 0) {
                    newTx = ""
                } else if (tx.length === 1) {
                    console.log(1)
                    newTx = `0,0${tx}`
                } else if (tx.length === 2) {
                    console.log(2)
                    newTx = `0,${tx.slice(0, 2)}`
                } else if (tx.length === 3) {
                    console.log(3)
                    newTx = `${tx.slice(0, 1)},${tx.slice(1, 3)}`
                } else if (tx.length === 4) {
                    console.log(4)
                    newTx = `${tx.slice(0, 2)},${tx.slice(2, 4)}`
                } else if (tx.length >= 5) {
                    console.log(4)
                    newTx = `${tx.slice(0, 3)},${tx.slice(3, 5)}`
                }
                document.getElementById(`preco-${product.uuid}`)['value'] = ("R$ " + newTx)
            }

            return (<div key={product.nomeprod}>


                <nav className="accordion arrows" style={{ 'marginBottom': '15px', 'width': '100%' }}>
                    <input type="radio" name="accordion" id={`open${product.uuid}`} />
                    <section className="box-edit">

                        <div id='prod' style={{ 'marginBottom': '10px', 'height': 'auto' }}>
                            <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center' }}>
                                <div style={{ 'margin': '5px 0 5px 5px' }}><strong>{product.nomeprod}</strong></div>
                                <div style={{ 'margin': '5px 5px 5px 0' }}><strong>{parseFloat(product.preco).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</strong></div>
                            </div>
                            <div key={product.id} style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '5px' }}>
                                <img src={product.img} alt={product.nomeprod} onClick={() => openModal(product.img)} style={{ 'width': '70px', 'height': '70px', 'boxShadow': '0 -1px 0 #e5e5e5, 0 0 2px rgba(0, 0, 0, .12), 0 2px 4px rgba(0, 0, 0, .24)', 'margin': '0 0 5px 5px' }}></img>
                                <div style={{ 'display': 'flex', 'alignItems': 'center', 'width': '100%' }}>
                                    <div style={{ 'padding': '0 5px 0 5px' }}>{product.ingr}</div>
                                </div>
                            </div>
                            <div style={{ 'width': '98%', 'marginBottom': '5px', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'padding': '5px' }}>
                                <div style={{ 'margin': '5px 0 5px 5px' }}><strong>{product.status}</strong></div>
                                <div>
                                    <label className="btn-co btn-l" htmlFor={`open${product.uuid}`}>Editar</label>
                                    <button className="btn-co btn-r" onClick={delProd}>Excluir</button>
                                </div>
                            </div>
                        </div >

                        <label className="box-close" htmlFor='acc-close'></label>
                        <div className="box-content">
                            <div style={{ 'width': '100%' }}>
                                <p style={{ 'margin': '0 0 1px 0' }}>Nome:</p>
                                <div style={{ 'width': '100%', 'display': 'flex' }}>
                                    <textarea className="ad-inp" defaultValue={product.nomeprod} id={`nome-${product.uuid}`} style={{ 'width': '100%', 'resize': 'none', 'padding': '8px 0 0 5px' }}></textarea>
                                </div>
                                <p style={{ 'margin': '0 0 1px 0' }}>Descrição:</p>
                                <div style={{ 'width': '100%', 'display': 'flex' }}>
                                    <textarea className="ad-inp" defaultValue={product.ingr} id={`desc-${product.uuid}`} style={{ 'width': '100%', 'height': '40px', 'resize': 'none', 'padding': '8px 0 0 5px' }} ></textarea>
                                </div>
                                <p style={{ 'margin': '0 0 1px 0' }}>Link imagem:</p>
                                <div style={{ 'width': '100%', 'display': 'flex' }}>
                                    <textarea className="ad-inp" defaultValue={product.img} id={`img-${product.uuid}`} style={{ 'width': '100%', 'resize': 'none', 'padding': '8px 0 0 5px' }}></textarea>
                                </div>
                                <p style={{ 'margin': '0 0 1px 0' }} >Preço:</p>
                                <div style={{ 'width': '100%', 'display': 'flex' }}>
                                    <textarea className="ad-inp" defaultValue={`R$ ${product.preco.replace(/[.]/, ',')}`} id={`preco-${product.uuid}`} onChange={verifyPriceEdit} style={{ 'width': '100%', 'resize': 'none', 'padding': '8px 0 0 5px' }}></textarea>
                                </div>
                                <p style={{ 'margin': '0 0 1px 0' }}>Categoria:</p>
                                <div style={{ 'width': '100%', 'display': 'flex' }}>
                                    <CategSelect idSel={`selCateg-${product.uuid}`} select={product.categ}></CategSelect>
                                </div>
                                <label htmlFor={`sel-${product.uuid}`} >Situação:</label>
                                <div style={{ 'width': '100%', 'display': 'flex' }}>
                                    <select className="editprod ad-inp" id={`selAtivo-${product.uuid}`} defaultValue={product.status} style={{ 'width': '50%', 'height': '36px', 'fontSize': '15px' }}>
                                        <option value='Ativo'>Ativo</option>
                                        <option value='Desativado'>Desativado</option>
                                    </select>
                                </div>
                                <br></br>
                            </div>
                            <div style={{ 'width': '100%', 'justifyContent': 'flex-end', 'display': 'flex' }}>
                                <button id='btn-cad' className="btn-co btn-l" onClick={verifyEditProd} style={{ 'marginTop': '15px', 'marginBottom': '30px' }}>Salvar</button>
                                <label className="btn-co btn-r" htmlFor='acc-close' style={{ 'marginTop': '15px', 'marginBottom': '30px' }}>Fechar</label>
                            </div>
                            <textarea className="ad-inp" id={`resp-${product.uuid}`} defaultValue="Resposta do servidor >" disabled style={{ 'width': '97%', 'height': '100px', 'backgroundColor': 'white', 'color': 'black', 'resize': 'none' }}></textarea>
                        </div>
                    </section>
                    <input type="radio" name="accordion-edit" id='acc-close' />
                </nav>
            </div>

            )
        }

        const filterActDes = () => {
            const act = document.getElementById('active')['checked']
            const des = document.getElementById('desactive')['checked']
            const all = document.getElementById('all')['checked']
            const listProd = JSON.parse(sessionStorage.getItem('listProduct'))
            sessionStorage.setItem('viewProducts', JSON.stringify(listProd))
            var status;
            if (act === true) {
                status = 'Ativo';
            } else {
                status = 'Desativado';
            };
            var newList = [];
            listProd.forEach(element => {
                if (element.status === status) {
                    newList.push(element)
                }
            });
            if (all === true) {
                setProduct(listProd.sort(compareName).sort(compare))
            } else {
                setProduct(newList.sort(compareName).sort(compare))
            }
        }



        async function editProd(productEdit) {
            colorMsgEdit('yellow', `resp-${productEdit[0].id}`, 'Aguardando reposta do servidor')
            const data = JSON.parse(sessionStorage.getItem('info'))

            const product = productEdit;
            const token = localStorage.getItem(`${companyTag}-token`)
            if (token !== undefined) {
                var resposta;
                await api({
                    method: 'PUT',
                    url: `/produtos/alterar`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    data: product
                })
                    .then(resp => {
                        resposta = resp.data;
                        colorMsgEdit('GREEN', `resp-${productEdit[0].id}`, resposta.message)

                        api.get(`/produtos/${data[0].tag}`).then(res => {
                            if (res.data[0].products === undefined) {
                                sessionStorage.setItem('listProduct', JSON.stringify([]))
                                colorMsgEdit('yellow', `resp-${productEdit[0].id}`, 'Produto atualizado! Porém houve um erro ao recuperar as informações do servidor. \n\nFeche a página e entre novamente para obter os dados atualizados.')
                            } else {
                                sessionStorage.setItem('listProduct', JSON.stringify(res.data[0].products))
                                sessionStorage.setItem('viewProducts', JSON.stringify(res.data[0].products))
                                const act = document.getElementById('active')['checked']
                                const des = document.getElementById('desactive')['checked']
                                var verifyStatus;
                                if (act === true) {
                                    verifyStatus = 'Desativado'
                                } else if (des === true) {
                                    verifyStatus = 'Ativo'
                                } else { verifyStatus = 'Todos' }
                                var listProdView = res.data[0].products.sort(compareName).sort(compare)

                                var newList = [];
                                listProdView.forEach(element => {
                                    if (element.status !== verifyStatus) {
                                        newList.push(element)
                                    }
                                });
                                setProduct(newList)

                            }
                        }).catch(error => {
                            colorMsgEdit('yellow', `resp-${productEdit[0].id}`, 'Produto atualizado! Porém houve um erro ao recuperar as informações do servidor. \n\nFeche a página e entre novamente para obter os dados atualizados.')
                        })

                    }).catch(error => {
                        resposta = error.toJSON();
                        if (resposta.status === 404) {
                            colorMsgEdit('RED', `resp-${productEdit[0].id}`, 'Erro 404 - Requisição invalida')
                        } else { colorMsgEdit('RED', `resp-${productEdit[0].id}`, `Erro ${resposta.status} - ${resposta.message}`) }
                    })
            } else { colorMsgEdit('RED', `resp-${productEdit[0].id}`, 'Usuário não autenticado.'); window.location.href = `${companyTag}/login` }
        }

        const productList = JSON.parse(sessionStorage.getItem('listProduct'))
        if (productList === null || productList.length === 0) {
            return (<><div style={{ 'display': 'flex', 'justifyContent': 'center', 'width': '100%' }}><h5>Você ainda não possui nenhum produto cadastrado.</h5></div></>)
        } else {
            return (
                <div className="list-prod" id='list-prod' style={{ 'width': '100%', 'fontSize': '15px' }}>
                    <input type='text' className="pesq-prod" id='prod-pesq' placeholder='Pesquisar' onChange={pesquisarProd} style={{ 'marginBottom': '20px', 'width': '97%' }}></input>
                    <div style={{ 'margin': '0 0 15px 0' }}>
                        <input type='radio' name='actDes' id='all' onChange={filterActDes} defaultChecked></input>
                        <label htmlFor='all'>Todos</label>
                        <input type='radio' name='actDes' id='active' onChange={filterActDes}></input>
                        <label htmlFor='active'>Ativos</label>
                        <input type='radio' name='actDes' id='desactive' onChange={filterActDes}></input>
                        <label htmlFor='desactive'>Desativos</label>
                    </div>
                    <div>
                        <p>{product.length} itens.</p>
                    </div>
                    {product.map(RenderOptions)}
                </div>
            )
        }
    }

    const [open, setOpen] = useState(false);
    //const handleOpen = () => setOpen(false);
    const handleClose = () => setOpen(false);
    const [img, setImg] = useState(undefined);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    function openModal(imgView) {
        setImg(imgView);
        setOpen(true)
    }

    function CategSelect(props) {

        // eslint-disable-next-line no-unused-vars
        var categsSel = [];
        const data = JSON.parse(sessionStorage.getItem('info'))
        const descCategs = JSON.parse(sessionStorage.getItem('categDesc'))
        const categ = data[0].categs.split(',')
        categ.forEach(categItem => {
            descCategs.forEach(categPay => {
                if (categItem === categPay.id) {
                    categsSel.push(categPay)
                }
            });
        });

        // @ts-ignore
        const [optionsCateg, setOptionsCateg] = useState(categsSel)


        const renderOptions = (optionsCateg, key) => {

            return (
                <option key={optionsCateg.desc} value={optionsCateg.desc}>{optionsCateg.desc}</option>
            )
        }

        return (
            <select className="editprod ad-inp" id={props.idSel} defaultValue={props.select} style={{ 'width': '73%', 'height': '36px', 'fontSize': '15px' }}>
                <option value='' hidden ></option>
                {optionsCateg.map(renderOptions)}
            </select>
        )
    }

    const colorMsg = (color, msg) => {
        document.getElementById('ad-resposta')['value'] = `${msg}`
        document.getElementById('ad-resposta').style.boxShadow = `0 -1px 0 ${color}, 0 0 2px ${color}, 0 2px 4px ${color}`
    }

    const colorMsgEdit = (color, id, msg) => {
        console.log(id)
        document.getElementById(id)['value'] = `${msg}`
        document.getElementById(id).style.boxShadow = `0 -1px 0 ${color}, 0 0 2px ${color}, 0 2px 4px ${color}`
    }

    async function reqServer() {
        colorMsg('yellow', 'Aguardando reposta do servidor')
        const nameProd = document.getElementById('ad-name')['value'],
            descPro = document.getElementById('ad-desc')['value'],
            imgPro = document.getElementById('ad-img')['value'],
            price = document.getElementById('ad-price')['value'],
            categPro = document.getElementById('sel-categ')['value'];
        const pricePro = price.replace(/[A-Za-z]/, '').replace(/[$]/, '').replace(/[,]/, '.').replace(/( )+/g, '').replace(/[R$ ]/, '');
        const data = JSON.parse(sessionStorage.getItem('info'))
        const tag = data[0].tag

        const product = [{ "nameprod": nameProd, "priceprod": pricePro, "imgprod": imgPro, "descprod": descPro, "categprod": categPro, "tagprod": tag }]
        if (nameProd !== '') {
            if (descPro !== '') {
                if (imgPro !== '') {
                    if (pricePro !== '') {
                        const regex = /\d|_/;
                        if (regex.test(pricePro) === true) {
                            const token = localStorage.getItem(`${companyTag}-token`)
                            if (token !== undefined) {
                                var resposta;
                                await api({
                                    method: 'POST',
                                    url: `/cadastro/produto`,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: token
                                    },
                                    data: product
                                })
                                    .then(resp => {
                                        resposta = resp.data;
                                        colorMsg('GREEN', resposta.message)

                                        api.get(`/produtos/${data[0].tag}`).then(res => {
                                            if (res.data[0].products === undefined) {
                                                sessionStorage.setItem('listProduct', JSON.stringify([]))
                                                colorMsg('yellow', 'Produto Inserido! Porém houve um erro ao recuperar as informações do servidor. \n\nFeche a página e entre novamente para obter os dados atualizados.')
                                            } else {
                                                sessionStorage.setItem('listProduct', JSON.stringify(res.data[0].products))
                                                sessionStorage.setItem('viewProducts', JSON.stringify(res.data[0].products))
                                                window.location.href = `${companyTag}/produtos`
                                            }
                                        }).catch(error => {
                                            colorMsg('yellow', 'Produto Inserido! Porém houve um erro ao recuperar as informações do servidor. \n\nFeche a página e entre novamente para obter os dados atualizados.')
                                        })

                                    }).catch(error => {
                                        resposta = error.toJSON();
                                        if (resposta.status === 404) {
                                            colorMsg('RED', 'Erro 404 - Requisição invalida')
                                        } else { colorMsg('RED', `Erro ${resposta.status} - ${resposta.message}`) }
                                    })
                            } else { colorMsg('RED', 'Usuário não autenticado.'); window.location.href = `${companyTag}/login` }
                        } else { colorMsg('RED', 'Preencha corretamente o campo Preço.') }
                    } else { colorMsg('RED', 'Preencha o campo Preço.') }
                } else { colorMsg('RED', 'Preencha o campo Link da Imagem.') }
            } else { colorMsg('RED', 'Preencha o campo Descrição.') }
        } else { colorMsg('RED', 'Preencha o campo nome.') }

    }

    const verifyPrice = () => {
        var tx = document.getElementById('ad-price')['value']
        tx = tx.replace(/0,0/g, '');
        tx = tx.replace(/0,00/g, '');
        tx = tx.replace(/0,/g, '');
        console.log(tx)
        tx = tx.replace(/[A-Za-z]/, '');
        tx = tx.replace(/\D/g, '');
        var newTx;
        if (tx.length === 0) {
            newTx = ""
        } else if (tx.length === 1) {
            console.log(1)
            newTx = `0,0${tx}`
        } else if (tx.length === 2) {
            console.log(2)
            newTx = `0,${tx.slice(0, 2)}`
        } else if (tx.length === 3) {
            console.log(3)
            newTx = `${tx.slice(0, 1)},${tx.slice(1, 3)}`
        } else if (tx.length === 4) {
            console.log(4)
            newTx = `${tx.slice(0, 2)},${tx.slice(2, 4)}`
        } else if (tx.length >= 5) {
            console.log(4)
            newTx = `${tx.slice(0, 3)},${tx.slice(3, 5)}`
        }
        document.getElementById('ad-price')['value'] = ("R$ " + newTx)
    }

    return (
        <>
            <Menu></Menu>
            <div className='logo-page'>
                <h4>Produtos:</h4>
            </div>
            <div className="data-checkout">

                <nav className="accordion arrows" style={{ 'marginBottom': '15px', 'width': '100%' }}>
                    <input type="radio" name="accordion" id="cb1" />
                    <section className="box">
                        <label className="box-title" id='title-cb1' htmlFor="cb1">Adicionar produto</label>
                        <label className="box-close" htmlFor="acc-close"></label>
                        <div className="box-content">
                            <div style={{ 'width': '100%' }}>
                                <p style={{ 'margin': '0 0 1px 0' }}>Nome:</p>
                                <div style={{ 'width': '100%', 'display': 'flex' }}>
                                    <textarea className="ad-inp" id="ad-name" style={{ 'width': '100%', 'resize': 'none', 'padding': '8px 0 0 5px' }}></textarea>
                                </div>
                                <p style={{ 'margin': '0 0 1px 0' }}>Descrição:</p>
                                <div style={{ 'width': '100%', 'display': 'flex' }}>
                                    <textarea className="ad-inp" id="ad-desc" style={{ 'width': '100%', 'resize': 'none', 'padding': '8px 0 0 5px' }} ></textarea>
                                </div>
                                <p style={{ 'margin': '0 0 1px 0' }}>Link imagem:</p>
                                <div style={{ 'width': '100%', 'display': 'flex' }}>
                                    <textarea className="ad-inp" id="ad-img" style={{ 'width': '100%', 'resize': 'none', 'padding': '8px 0 0 5px' }}></textarea>
                                </div>
                                <p style={{ 'margin': '0 0 1px 0' }} >Preço:</p>
                                <div style={{ 'width': '100%', 'display': 'flex' }}>
                                    <textarea className="ad-inp" id="ad-price" style={{ 'width': '100%', 'resize': 'none', 'padding': '8px 0 0 5px' }} defaultValue='R$ ' onChange={verifyPrice}></textarea>
                                </div>
                                <p style={{ 'margin': '0 0 1px 0' }}>Categoria:</p>
                                <div style={{ 'width': '100%', 'display': 'flex' }}>
                                    <CategSelect idSel='sel-categ'></CategSelect>
                                </div>
                                <br></br>
                            </div>
                            <button id='btn-cad' className="btn  btn-success" onClick={reqServer} style={{ 'marginTop': '15px', 'marginBottom': '30px' }}>Registrar Produto</button>
                            <textarea className="ad-inp" id='ad-resposta' defaultValue="Resposta do servidor >" disabled style={{ 'width': '97%', 'height': '100px', 'backgroundColor': 'white', 'color': 'black', 'resize': 'none' }}></textarea>
                        </div>
                    </section>
                    <input type="radio" name="accordion" id="acc-close" />
                </nav>

                <br></br>
                <div id='pesq' style={{ 'width': '100%', 'display': 'flex' }}>
                    <ListProducts ></ListProducts>
                </div>
            </div >

            <div>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {/* <strong>Editar: {product.nomeprod}</strong> */}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <div style={{ 'justifyContent': 'center', 'display': 'flex' }}>
                                <img src={img} alt='img-load-error' style={{ 'width': '100%' }}></img>
                            </div>
                        </Typography>
                    </Box>
                </Modal >
            </div >
        </>
    )
}
export default Produtos;