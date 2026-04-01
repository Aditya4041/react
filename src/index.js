import React from 'react';
import ReactDOM from 'react-dom/client';
import Idsspl from './Idsspl';
import App from './App';
import Main from './Main'

const adi = ReactDOM.createRoot(document.getElementById('adi'));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Idsspl />
  </React.StrictMode>
);

adi.render(
  <>
  <Main />
  </>
)