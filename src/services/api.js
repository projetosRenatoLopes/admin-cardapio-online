import axios from "axios";
import { useState } from 'react'

const api = axios.create({
  baseURL: "https://api-cardapio-online.onrender.com/",
 //baseURL: "http://192.168.0.40:8680/",
});


export const GetInfoApi = async (company) => {
  const [dataApi, setDataApi] = useState(null);

  await api.get(`empresa/${company}`).then(response => {
    setDataApi(response);
  });

  return dataApi;
}

export const GetCompanies = () => {
  const [dataCompanies, setDataCompanies] = useState(null);

  api.get("empresa").then(response => {
    dataCompanies(response.data);
  });

  return dataCompanies;
}

export const GetProducts = (company) => {
  const [products, setProducts] = useState(null);

  api.get(`produtos/${company}`).then(response => {
    products(response.data);
  });

  return products;
}


export default api;
