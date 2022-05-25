import './inputEmail.css'
import React from "react";
import { FaUserAlt } from 'react-icons/fa'



const InputEmail = ( { className, placeholder } ) => {

    return(
        <>
            <div className="input-email">           
                <FaUserAlt />
                <input type="email" id="user"  className={className} placeholder={placeholder}  ></input>
            </div>
            
        </>
    )
};

export default InputEmail