import React, { useEffect, useState } from "react";
import { SiGooglemaps } from 'react-icons/si'
import { AiFillClockCircle } from 'react-icons/ai'
import { RiMoneyDollarCircleFill } from 'react-icons/ri'
import refreshData from "../../utils/refreshData";

const getInfoApi = JSON.parse(sessionStorage.getItem('info'))


var paymentMethods = [];
if (getInfoApi === undefined || getInfoApi === null) {
    //rota erro 
} else {
    const descPayModes = JSON.parse(sessionStorage.getItem('payModes'))
    const pay = getInfoApi[0].paymodes.split(',')
    pay.forEach(payItem => {
        descPayModes.forEach(descPay => {
            if (payItem === descPay.id) {
                paymentMethods.push(descPay.desc)
            }
        });
    });
}

var categApi = [];
if (getInfoApi === undefined || getInfoApi === null) {
     //rota erro 
} else {
    const descCategs = JSON.parse(sessionStorage.getItem('categDesc'))
    const categ = getInfoApi[0].categs.split(',')
    categ.forEach(categItem => {
        descCategs.forEach(categPay => {
            if (categItem === categPay.id) {
                categApi.push(categPay.desc)
            }
        });
    });
}

export var myCategs = () => categApi;


var company = null;
var openingHours = null;
var address = null;
if (getInfoApi === null) {

} else {
    company = getInfoApi[0].name
    openingHours = [getInfoApi[0].funcdom, getInfoApi[0].funcseg, getInfoApi[0].functer, getInfoApi[0].funcqua, getInfoApi[0].funcqui, getInfoApi[0].funcsex, getInfoApi[0].funcsab]
    address = [getInfoApi[0].adrrua, getInfoApi[0].adrnum, getInfoApi[0].adrcom, getInfoApi[0].adrbai, getInfoApi[0].adrcid, getInfoApi[0].adrest]
}


export var CompanyName = (
    <>
        <p>{company}</p>
    </>
);

const InfoCompany = () => {
    const [openHours, setOpenHours] = useState(openingHours)
    useEffect(() => {
        const interval = setInterval(() => {
          refreshData()
          const getInform = JSON.parse(sessionStorage.getItem('info'))
          setOpenHours([getInform[0].funcdom, getInform[0].funcseg, getInform[0].functer, getInform[0].funcqua, getInform[0].funcqui, getInform[0].funcsex, getInform[0].funcsab])
        }, 10000);
        return () => clearInterval(interval)
      }, []);


    const dayWeek = new Date();
    const week = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado']
    const today = dayWeek.getDay();
    var showDay = week[today];
    var openingHoursRange = openHours[today]

    function colorDay(day, hours) {
        if (day === showDay) {
            if (hours === 'Fechado') {
                sessionStorage.setItem('ofp', 'false')
                return <div id='todayInfo' style={{ color: 'RED','textShadow':'#202020' }}>{day}: {hours}</div>
            } else {
                const date = new Date();
                const hr = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
                if (hours.slice(0, 5) < hr && hours.slice(6, 11) > hr) {
                    sessionStorage.setItem('ofp', 'true')
                    return <div style={{ color: '#3eca89' }}>{day}: {hours}</div>
                } else {
                    sessionStorage.setItem('ofp', 'false')
                    return <div style={{ color: '#dc3545' }}>{day}: {hours}</div>
                }
            }
        } else {
            return <div style={{ color: '#000000' }}>{day}: {hours}</div>
        }
    }

    return (
        <>
            <div className='companny-info' >
                <nav className="accordion arrows">
                    <input type="radio" name="accordion" id="cb1" />
                    <section className="box">
                        <label className="box-title" id='title-cb1' htmlFor="cb1"><AiFillClockCircle />{colorDay(showDay, openingHoursRange)}</label>
                        <label className="box-close" htmlFor="acc-close"></label>
                        <div className="box-content">
                            {colorDay(week[0], openHours[0])}
                            <br></br>
                            {colorDay(week[1], openHours[1])}
                            <br></br>
                            {colorDay(week[2], openHours[2])}
                            <br></br>
                            {colorDay(week[3], openHours[3])}
                            <br></br>
                            {colorDay(week[4], openHours[4])}
                            <br></br>
                            {colorDay(week[5], openHours[5])}
                            <br></br>
                            {colorDay(week[6], openHours[6])}
                        </div>
                    </section>
                    <input type="radio" name="accordion" id="cb2" />
                    <section className="box">
                        <label className="box-title" htmlFor="cb2"><SiGooglemaps className='icon-local' />{address[4]} - {address[5]}</label>
                        <label className="box-close" htmlFor="acc-close"></label>
                        <div className="box-content">{address[0]}, Nº {address[1]} {address[2]}, {address[3]}, {address[4]} - {address[5]}.</div>
                    </section>
                    <input type="radio" name="accordion" id="cb3" />
                    <section className="box">
                        <label className="box-title" htmlFor="cb3"><RiMoneyDollarCircleFill />Aceitamos: {paymentMethods.join(', ')}</label>
                        <label className="box-close" htmlFor="acc-close"></label>
                        <div className="box-content">{paymentMethods.join(', ')}.</div>
                    </section>
                    <input type="radio" name="accordion" id="acc-close" />
                </nav>
            </div>
        </>
    )
}

export default InfoCompany