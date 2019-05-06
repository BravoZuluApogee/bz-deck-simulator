import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './css/index.css';

import { CookiesProvider } from 'react-cookie';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <CookiesProvider><App /></CookiesProvider>, 
    document.getElementById('root')
);

serviceWorker.unregister();
