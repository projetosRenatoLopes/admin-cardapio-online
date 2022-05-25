import React, { memo, useState } from 'react'



function PayementsModes(props) {
    const { options } = props;

    // eslint-disable-next-line no-unused-vars
    const [optionsPayment, setGallery] = useState(options)

    const renderOptions = (optionsPayment, key) => {

        return (
            <option className='co-data' key={optionsPayment}  value={optionsPayment}>{optionsPayment}</option>
        )
    }

    return (
            <select id="co-input-sel" className='co-data' defaultValue='Forma de Pagamento' required>
                <option value='Forma de Pagamento' hidden >Forma de Pagamento</option>
                {optionsPayment.map(renderOptions)}
            </select>
    )
}

export default memo(PayementsModes)