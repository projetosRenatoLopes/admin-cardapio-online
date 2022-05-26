// @ts-nocheck
import React from "react";
import { Routes, Route} from 'react-router-dom';
import Load from "./pages/Load.js";
import Erro from "./pages/Erro";
import NotFound from "./pages/NotFound";
import Administrador from "./pages/Administrador";
import Home from "./pages/Home";
import Info from "./pages/Info.js";
import Produtos from "./pages/Produtos.js";
import Horario from "./pages/Horario.js";
import Login from "./pages/Login.js";
import User from "./pages/User.js";
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    const company = sessionStorage.getItem('tag')
    return (
        <Routes >    
            <Route exact path=":company" element={<Load />} />
            <Route exact path={`${company}/home`} element={<Home />} />
            <Route exact path={`${company}/info`} element={<Info />} />
            <Route exact path={`${company}/produtos`} element={<Produtos />} />
            <Route exact path={`${company}/horario`} element={<Horario />} />
            <Route exact path={`${company}/Login`} element={<Login />} />
            <Route exact path={`${company}/user`} element={<User />} />
            <Route exact path={`${company}/erro`} element={<Erro />} />
            <Route exact path={`/admingpco`} element={<Administrador />} />
            <Route exact path={'/erro'} element={<Erro />} />
            <Route exact path={`:uuid/*`} element={<NotFound />} />
            <Route exact index element={<div><NotFound /></div>} />
        </Routes>
    );
}
