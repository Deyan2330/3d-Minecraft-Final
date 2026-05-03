// This is the first JavaScript file the browser runs.
// Its job is simple: put the React game into the HTML page.
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  // StrictMode helps React warn developers about unsafe code while building.
  <StrictMode>
    <App />
  </StrictMode>,
  // public/index.html has <div id="root"></div>. The whole game goes there.
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
