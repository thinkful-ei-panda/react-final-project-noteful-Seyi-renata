import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import AppError from './AppError/AppError'
import App from './App';
import './index.css';

ReactDOM.render(
  <AppError>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </AppError>,
  document.getElementById('root')
);