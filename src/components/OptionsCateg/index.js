import { useState } from "react";

function OptionsCateg() {

    const categs = JSON.parse(sessionStorage.getItem('categ'))
    // eslint-disable-next-line no-unused-vars
    const [optionsCateg, setOptionsCateg] = useState(categs)


    const renderOptions = (optionsCateg, key) => {
        var isCheked = false;
        const data = JSON.parse(sessionStorage.getItem('info'))
        const categ = data[0].categs.split(',')
        categ.forEach(categItem => {
            if (optionsCateg.id === categItem) {
                isCheked = true
            }
        });
        return (
            <div key={optionsCateg.desc} style={{ 'width': '120px', 'marginBottom': '15px' }}>
                <input type={'checkbox'} id={optionsCateg.desc} value={optionsCateg.id} defaultChecked={isCheked}></input>
                <label htmlFor={optionsCateg.desc}>{optionsCateg.desc}</label>
            </div>
        )
    }

    return (
        <div className='checkCateg' style={{ 'width': '100%', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'flexWrap': 'wrap' }}>
            {optionsCateg.map(renderOptions)}
        </div>
    )
}

export default OptionsCateg;