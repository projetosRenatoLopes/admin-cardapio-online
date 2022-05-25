import { useState } from "react";

function OptionsPayModes() {

    const payModes = JSON.parse(sessionStorage.getItem('payModes'))
    // eslint-disable-next-line no-unused-vars
    const [optionsPayModes, setOptionsPayModes] = useState(payModes)

    const renderOptions = (optionsPayModes, key) => {
        var isCheked = false;
        const data = JSON.parse(sessionStorage.getItem('info'))
        const payMode = data[0].paymodes.split(',')
        payMode.forEach(payItem => {
            if (optionsPayModes.id === payItem) {
                isCheked = true
            }
        });
        return (
            <div key={optionsPayModes.desc} style={{ 'width': '120px', 'marginBottom': '15px' }}>
                <input type={'checkbox'} id={optionsPayModes.desc} value={optionsPayModes.id} defaultChecked={isCheked}></input>
                <label htmlFor={optionsPayModes.desc}>{optionsPayModes.desc}</label>
            </div>
        )
    }

    return (
        <div className='checkPayModes' style={{ 'width': '100%', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'flexWrap': 'wrap' }}>
            {optionsPayModes.map(renderOptions)}
        </div>
    )
}

export default OptionsPayModes;