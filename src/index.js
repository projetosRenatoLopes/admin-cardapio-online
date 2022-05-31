import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AlertMUITemplate from "react-alert-template-basic";
import { positions, Provider } from "react-alert";

const options = {
    timeout: 10000,
    position: positions.BOTTOM_CENTER
};

ReactDOM.render(
    // @ts-ignore
    <Provider template={AlertMUITemplate} {...options}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
);
