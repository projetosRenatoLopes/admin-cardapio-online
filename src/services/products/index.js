import { compare } from '../orderById';
//import products from './products.json'


export function listProducts() {

    let arrProduct = JSON.parse(sessionStorage.getItem('listProduct'));
    if (arrProduct === null) {
        window.location.href = '/erro500'
    } else {
        sessionStorage.setItem('viewProducts', JSON.stringify(arrProduct))

        var listProducts = sessionStorage.getItem('viewProducts');
        var arrProducts;
        if (listProducts === null || listProducts === '{}') {
            arrProducts = ""
        } else {
            arrProducts = JSON.parse(listProducts);
            arrProducts.sort(compare);
        }
        return arrProducts;
    }
}