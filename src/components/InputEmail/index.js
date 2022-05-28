import './inputEmail.css'
import React from "react";
import { FaUserAlt } from 'react-icons/fa'



const InputEmail = ({ className, placeholder, defaultValue }) => {

    return (
        <>
            <div className="input-email">
                <FaUserAlt />
                <input type="text" id="user" defaultValue={defaultValue} className={className} placeholder={placeholder}></input>
            </div>

        </>
    )
};

export default InputEmail